// End-to-end suite (Chromium, 1440×900). Audio is muted at the browser level
// but real Tone.js scheduling runs; assertions target visible playback state.

import { test, expect, type Page } from '@playwright/test'

const pageErrors: string[] = []

test.beforeEach(async ({ page }) => {
  pageErrors.length = 0
  page.on('pageerror', (error) => pageErrors.push(error.message))
})

async function gotoAtlas(page: Page, hash = '') {
  await page.goto(`/${hash}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.score__svg svg')
}

test('loads all ten lessons without uncaught errors', async ({ page }) => {
  await gotoAtlas(page)
  await expect(page.locator('section.lesson')).toHaveCount(10)
  await expect(page.locator('h1')).toContainText('Jazz Piano Theory Atlas')
  // Every lesson renders at least one interactive panel or exercise.
  for (const id of [
    'melody-harmony', 'diatonic-harmony', 'extensions-alterations', 'secondary-dominants',
    'tritone-substitutions', 'modal-interchange', 'modulation', 'diminished-systems',
    'sixth-diminished', 'reharmonization',
  ]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }
  expect(pageErrors).toEqual([])
})

test('sticky navigation scrolls to a lesson and updates the hash', async ({ page }) => {
  await gotoAtlas(page)
  await page.getByRole('link', { name: /lesson 4:/i }).click()
  await expect(page).toHaveURL(/#secondary-dominants$/)
  await expect(page.locator('#secondary-dominants')).toBeInViewport()
  // The active chip follows.
  await expect(page.getByRole('link', { name: /lesson 4:/i })).toHaveAttribute(
    'aria-current',
    'true',
  )
})

test('deep link reveals the requested lesson on load', async ({ page }) => {
  await gotoAtlas(page, '#tritone-substitutions')
  await expect(page.locator('#tritone-substitutions')).toBeInViewport()
})

test('an example plays, advances visually, stops, and clears highlights', async ({ page }) => {
  await gotoAtlas(page)
  const panel = page.locator('[data-example-id="l1-guide-tones"]')
  await panel.scrollIntoViewIfNeeded()
  await panel.getByRole('button', { name: /play ii–v–i/i }).click()
  // Visible playback state: panel marked playing, a current chord shown,
  // keyboard keys highlighted, score notes carrying the current class.
  await expect(panel).toHaveAttribute('data-playing', 'true')
  const nowChord = panel.locator('.panel__now strong')
  await expect(nowChord).toBeVisible({ timeout: 15000 })
  const first = await nowChord.textContent()
  expect(['Dm7', 'G7', 'Cmaj7']).toContain(first)
  await expect(panel.locator('.piano-key.is-active').first()).toBeVisible()
  await expect(panel.locator('.jpta-current').first()).toBeVisible()
  // Visually advances to a different chord (4 beats each at 76 BPM).
  await expect.poll(async () => nowChord.textContent(), { timeout: 15000 }).not.toBe(first)
  // Stop clears everything.
  await panel.getByRole('button', { name: /stop ii–v–i/i }).click()
  await expect(panel).not.toHaveAttribute('data-playing', 'true')
  await expect(panel.locator('.piano-key.is-active')).toHaveCount(0)
  await expect(panel.locator('.jpta-current')).toHaveCount(0)
  expect(pageErrors).toEqual([])
})

test('transposition updates chord symbols and keyboard labels', async ({ page }) => {
  await gotoAtlas(page)
  const panel = page.locator('[data-example-id="l1-guide-tones"]')
  await panel.scrollIntoViewIfNeeded()
  await expect(panel.locator('.score__symbol').first()).toHaveText('Dm7')
  await panel.getByRole('combobox', { name: /key for/i }).selectOption('Eb')
  await expect(panel.locator('.score__symbol').first()).toHaveText('Fm7')
  await expect(panel.locator('.score__symbol').nth(1)).toHaveText('B♭7')
  // The sr-only key statement follows too.
  await expect(panel.locator('text=Currently in the key of E♭')).toHaveCount(1)
})

test('clear/jazz voicing changes the notated voicing', async ({ page }) => {
  await gotoAtlas(page)
  const panel = page.locator('[data-example-id="l1-guide-tones"]')
  await panel.scrollIntoViewIfNeeded()
  const scoreContent = () => panel.locator('.score__svg').innerHTML()
  const clearScore = await scoreContent()
  const jazzButton = panel
    .getByRole('group', { name: /voicing/i })
    .getByRole('button', { name: 'Jazz' })
  await jazzButton.click()
  await expect(jazzButton).toHaveAttribute('aria-pressed', 'true')
  // The notation re-renders with different content (fewer stacked tones in
  // the shell voicing) while symbols stay identical.
  await expect.poll(scoreContent, { timeout: 5000 }).not.toBe(clearScore)
  await expect(panel.locator('.score__symbol').first()).toHaveText('Dm7')
})

test('analysis can be hidden and revealed globally', async ({ page }) => {
  await gotoAtlas(page)
  const panel = page.locator('[data-example-id="l1-guide-tones"]')
  await panel.scrollIntoViewIfNeeded()
  await expect(panel.locator('.score__roman').first()).toHaveText('ii7')
  await page.getByRole('button', { name: 'Settings' }).click()
  await page.getByRole('checkbox', { name: /show harmonic analysis/i }).uncheck()
  await page.keyboard.press('Escape')
  await expect(panel.locator('.score__roman')).toHaveCount(0)
  await page.getByRole('button', { name: 'Settings' }).click()
  await page.getByRole('checkbox', { name: /show harmonic analysis/i }).check()
  await page.keyboard.press('Escape')
  await expect(panel.locator('.score__roman').first()).toHaveText('ii7')
})

test('an exercise answers, reveals, and resets', async ({ page }) => {
  await gotoAtlas(page)
  const exercise = page.locator('[data-exercise-title="Name the function"]')
  await exercise.scrollIntoViewIfNeeded()
  await exercise.getByRole('button', { name: /dominant — it pulls to c/i }).click()
  await expect(exercise.locator('.exercise__feedback--incorrect')).toBeVisible()
  await exercise.getByRole('button', { name: /predominant — sets up/i }).click()
  await expect(exercise.locator('.exercise__feedback--correct')).toBeVisible()
  await exercise.getByRole('button', { name: 'Hint' }).click()
  await expect(exercise.locator('.exercise__hint')).toBeVisible()
  await exercise.getByRole('button', { name: /reveal answer/i }).click()
  await expect(exercise.locator('.exercise__explanation')).toBeVisible()
  await exercise.getByRole('button', { name: 'Reset' }).click()
  await expect(exercise.locator('.exercise__explanation')).toHaveCount(0)
  await expect(exercise.locator('.exercise__feedback--correct')).toHaveCount(0)
})

test('theme and tempo preferences survive reload', async ({ page }) => {
  await gotoAtlas(page)
  await page.getByRole('button', { name: 'Settings' }).click()
  await page.getByRole('button', { name: 'Dark', exact: true }).click()
  const tempo = page.getByLabel('Default tempo')
  await tempo.fill('132')
  await page.keyboard.press('Escape')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  await page.reload({ waitUntil: 'networkidle' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Settings' }).click()
  await expect(page.getByLabel('Default tempo')).toHaveValue('132')
})

test('narrow viewports show the desktop-only notice', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 })
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByTestId('desktop-gate')).toBeVisible()
  await expect(page.getByText(/designed for desktop screens/i)).toBeVisible()
  await expect(page.locator('section.lesson')).toHaveCount(0)
  // Widening restores the app.
  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(page.locator('section.lesson')).toHaveCount(10)
})

test('the upper-structure explorer responds to triad and key changes', async ({ page }) => {
  await gotoAtlas(page, '#diminished-systems')
  const panel = page.locator('[data-example-id="l8-ust-explorer"]')
  await panel.scrollIntoViewIfNeeded()
  await expect(panel.locator('.score__symbol').first()).toHaveText('F13(♭9)')
  await panel.getByRole('button', { name: 'A♭ major' }).click()
  await expect(panel.locator('.score__symbol').first()).toHaveText('F7(♯9)')
  await panel.getByRole('combobox', { name: /dominant root/i }).selectOption('C')
  await expect(panel.locator('.score__symbol').first()).toHaveText('C7(♯9)')
  await expect(panel.locator('.explorer__table')).toContainText('♯9')
  expect(pageErrors).toEqual([])
})
