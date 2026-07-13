# Jazz Piano Theory Atlas — working notes

Desktop-only, fully offline, client-side reference app: Vite + React + TS
(strict) + Tone.js + VexFlow 4. No backend, no deployment config, no CI —
deliberately. Do not add `.github/workflows`, hosting config, or analytics.

## Validation commands

- `npm run check` — typecheck + ESLint + Vitest + build (must stay green)
- `npm run test:e2e` — Playwright (Chromium only; in the Claude cloud
  environment the pre-installed browser at `/opt/pw-browsers/chromium` is
  used automatically via `playwright.config.ts`)
- `npm run check:all` — both

## Architecture map

- `src/music/` — the domain core. Spelled pitch (letter+alter+octave; MIDI
  always derived), letter-aware intervals/transposition, chord symbols
  (structured, never display strings), key choices, scales/collections,
  and `example.ts` (ExampleSpec → RenderedExample: the single model that
  drives audio, notation, keyboard, symbols, analysis).
- `src/audio/` — `engine.ts` (Sampler over bundled Salamander subset, synth
  fallback, common interface) and `player.tsx` (PlayerProvider: Transport +
  Part scheduling in tick notation, Draw-synced UI callbacks, one active
  example at a time). Tone.js is imported dynamically on first gesture —
  never at module top level (tests rely on this).
- `src/notation/` — `scoreModel.ts` (pure measures/stacks; throws on barline
  crossings and melody-beat mismatches) and `ScoreView.tsx` (VexFlow SVG,
  recolored to `currentColor` for theming; chord symbols/romans are HTML
  overlays anchored by `getAbsoluteX`; playback highlight = CSS class toggle
  on cached note groups, no re-render).
- `src/keyboard/` — pure geometry + `PianoKeyboard` (buttons, roving focus,
  pointer free-play, selection mode for exercises).
- `src/components/MusicPanel.tsx` — the shared example panel. All lesson
  examples go through it (the explorer and reharm lab feed it dynamic specs).
- `src/exercises/` — ExerciseShell + ChoiceExercise + BuildExercise.
- `src/lessons/` — ten lesson files (prose + exported ExampleSpecs),
  `authoring.ts` (`ch()` shorthand), `allExamples.ts` (test aggregation),
  custom feature components (UpperStructureExplorer, ReharmLab,
  DimCollectionsViz).
- `src/app/` — settings (versioned localStorage `jpta:prefs`), navigation
  (scroll-spy with `history.replaceState`, collapse state), header, gate.

## Music-domain invariants (enforced by tests — keep them true)

- Spelling is authoritative; never author MIDI numbers. `midiOf` derives.
- Transposition = letter steps + semitones, nearest direction; the F♯/G♭
  key resolves per example (fewest/mildest accidentals, near-ties follow the
  home key's fifths direction — see `resolveTonic`).
- Chords must not cross barlines; melody beats must sum to chord beats;
  durations limited to `durationForBeats` table.
- Register: after transposition, whole voices shift by octaves into
  [E1..C4] (bass) / [D3..D6] (treble). The user Register control is a
  separate, pure octave shift.
- Every symbol's root pitch class must sound in its chord (bass, voicing,
  or melody); slash-chord basses must match the notated bass.
- `lessons.invariants.test.ts` re-audits every example in all 12 keys ×
  both voicings × all variants (plus all 16 reharm-lab combos) on every
  test run. Add new examples to `allExamples.ts` or they escape the audit.

## Theory conventions used in content

- "Fully diminished" = the °7 chord. Scales are named half–whole or
  whole–half explicitly; never "the diminished scale" alone.
- Three diminished *collections* under 12-TET transposition; chords are
  spelled, aimed objects on top of them — content never says "only three
  diminished chords."
- 7(♭9) chords: root + °7 on the major 3rd. G/B♭/D♭/E family shares the
  B–D–F–A♭ upper structure as sounding pcs; the five-note chords differ.
  Strict spellings appear where required (C♭ over B♭7(♭9), E♭♭ over D♭7(♭9))
  with equal-temperament "sounds as" hints in Analyze panels.
- Sixth-diminished (Barry Harris–associated; labeled as such): C6 ∪ B°7 =
  C D E F G A♭ A B; minor form swaps E→E♭. Jazz voicing = drop-2.
- Tensions are contextual; content avoids "never/always" claims.

## Gotchas

- VexFlow 4 struct fields are snake_case (`stem_direction`, `num_beats`,
  `first_note`, `beam_rests`). Pinned to 4.x for its embedded music font
  (offline guarantee); v5 changes font loading.
- jsdom tests: `useMeasure` reports width 0, so `ScoreView` inside panels
  skips VexFlow (tests that want real notation pass `width` explicitly).
  `window.matchMedia` is stubbed in `src/test/setup.ts` (`__setMedia`).
- Component tests inject `makeFakePlayer()` via `PlayerContext` — never
  instantiate a real AudioContext in jsdom.
- Melody ties merge attacks only within one chord's melody list; don't
  author cross-chord melody ties.
- The `.score__scroll` container clips vertically; symbol/roman overlays
  live inside `.score__inner` padding — don't move them out.
