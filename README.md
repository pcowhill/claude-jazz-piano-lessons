# Jazz Piano Theory Atlas

*A fast, interactive reference for hearing jazz harmony at the keyboard.*

The Atlas is a desktop-only, fully client-side web application for
intermediate pianists: ten compact lessons that move from voice leading to
reharmonization, each built around playable examples — grand-staff notation
above, an animated piano keyboard below, chord symbols and Roman-numeral
analysis in between, and audio driven by the very same data. Everything
transposes to all 12 keys, flips between plain ("Clear") and idiomatic
("Jazz") voicings, and can be interrogated through small exploratory
exercises.

It is a *reference*, not a course: all ten lessons live on one continuous
page, nothing is gated, nothing is scored, and no progress is tracked.

## Audience and scope

The reader already knows note names, major/minor scales, intervals, triads,
basic seventh chords, key signatures, and elementary Roman numerals. The
lessons spend their time on practical jazz harmony:

1. **Melody, Harmony, and Voice Leading** — `#melody-harmony`
2. **Diatonic Harmony and Functional Progressions** — `#diatonic-harmony`
3. **Seventh Chords, Extensions, and Alterations** — `#extensions-alterations`
4. **Secondary Dominants** — `#secondary-dominants`
5. **Tritone Substitutions** — `#tritone-substitutions`
6. **Modal Interchange and Borrowed Chords** — `#modal-interchange`
7. **Tonicization and Modulation** — `#modulation`
8. **Diminished Systems** (feature lesson, incl. the upper-structure explorer) — `#diminished-systems`
9. **Barry Harris–Style Sixth-Diminished Harmony** (feature lesson) — `#sixth-diminished`
10. **Reharmonization and Practical Application** (incl. the reharm lab) — `#reharmonization`

All musical examples are original material written for this project. Generic
devices (ii–V–I, turnarounds, twelve-bar form) are discussed as common
practice; no copyrighted tunes, lead sheets, or solos are quoted.

## Desktop-only, by design

The interactive score-and-keyboard panels need width. The layout targets
**1440 × 900** and supports **1100 px and wider**; below 1100 px a full-page
notice replaces the app. Current desktop Chrome is the primary tested
browser, with standards-compatible behavior expected in current Edge,
Firefox, and Safari. There is intentionally no mobile or touch layout.

## Technology

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript (strict)
- [Tone.js](https://tonejs.github.io) — polyphonic playback and transport scheduling
- [VexFlow](https://vexflow.com) 4.x — SVG music notation (4.x is used deliberately:
  its music font is embedded in the bundle, keeping the offline guarantee
  trivial)
- Vitest + React Testing Library + `@testing-library/user-event` — unit/component tests
- Playwright (Chromium only) — end-to-end tests
- Plain CSS with custom-property design tokens; no UI framework
- React context + ordinary hooks for shared state; no external state library

## Local setup

```bash
npm install
npm run dev        # development server
```

Requires Node 22.12+.

## npm commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript project check |
| `npm test` | Vitest in watch mode |
| `npm run test:run` | Vitest, single pass |
| `npm run test:e2e` | Playwright suite (builds + serves automatically) |
| `npm run check` | typecheck + lint + unit tests + build |
| `npm run check:all` | `check` + Playwright |

Inspect the production build with `npm run preview` (or any static file
server pointed at `dist/`). Opening `dist/index.html` directly via the
`file:` protocol is not a supported path.

## Audio: sampled piano with a synth fallback

The instrument is a **Tone.js `Sampler`** over a bundled 21-note subset of
the **Salamander Grand Piano V3** (Alexander Holm, CC BY 3.0 — exact
attribution in [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md)).
Samples are spaced in minor thirds; intermediate pitches use playback-rate
transposition. If the samples fail to load, a shaped polyphonic synth
(custom partials, piano-like envelope, low-pass filter, light reverb,
limiter) takes over behind the same engine interface. The active mode is
shown in Settings ("Sampled piano" / "Synth piano").

Audio begins only after a user gesture (any play button or piano key), per
browser autoplay policy. Only one example plays at a time; starting another
stops the previous one cleanly.

## Offline guarantee

After the page loads, the app needs **no network at all**: JavaScript, CSS,
fonts (system font stacks only), notation (VexFlow's embedded music font),
piano samples, and all data ship in the bundle or `public/`. The Vite `base`
is relative (`./`), so `dist` is host-agnostic. External links in the
Sources section are optional further reading, never runtime dependencies.

## How music examples are represented

Every playable example is an `ExampleSpec` (see `src/music/example.ts`):
chords with beats, a structured chord symbol (spelled root/kind/bass — never
a display string), Roman numeral, function tag, **spelled-pitch voicings**
for Clear and Jazz modes, optional melody notes, emphasis (guide-tone)
marks, and analysis notes. One rendering pass (`renderExample`) produces the
single model that drives audio scheduling, VexFlow notation, keyboard
highlighting, chord-symbol overlays, and the Analyze panel — so they cannot
drift apart.

Spelling is the source of truth: a pitch is letter + alteration + octave
(`{E, ♭, 4}`), and MIDI numbers are always derived. Double flats/sharps are
first-class (`E♭♭` is the ♭9 of D♭7(♭9), and renders that way).

### Transposition and register

Transposition is **letter-aware**: the interval from home tonic to target
tonic is measured in (letter steps, semitones) and applied to every spelled
pitch, so chromatic functions keep their spelling in every key (the ♭9 of C7
— D♭ — becomes E♭♭ in D♭, not D). The six-semitone key offers both F♯ and
G♭; each example picks whichever spelling yields fewer (and milder)
accidentals, with near-ties resolved toward the home key's flat/sharp side.
After transposition, voicings are re-anchored per voice into a practical
piano range. The **Register** control is separate: it shifts sounding octave
without touching the harmony.

### Adding or editing an example

1. Author the spec in the relevant `src/lessons/LessonNN.tsx` using the
   `ch()` helper (`src/lessons/authoring.ts`): beats, symbol, roman, clear +
   jazz voicings as spelled-pitch strings, optional melody/emphasis/notes.
2. Add it to a `<MusicPanel spec={...} />` and to `src/lessons/allExamples.ts`.
3. Run `npm run test:run` — the invariants suite automatically audits the new
   example in all 12 keys and both voicings (bar arithmetic, spelling limits,
   register bounds, symbol-root soundness, notatable durations).

## Testing

- **Unit** (`src/**/*.test.ts`): pitch parsing/formatting, letter-aware
  transposition across all 12 tonics, contextual spelling (C♭, E♭♭),
  chord-symbol generation, register vs. key independence, diminished
  symmetry and the three collections, the 7(♭9) upper-structure family, the
  half–whole/whole–half scales, both sixth-diminished collections, timing
  conversion, and preference migration.
- **Data invariants** (`src/lessons/lessons.invariants.test.ts`): every
  example × 12 keys × 2 voicings × all variants, all 16 reharm-lab
  combinations, and note-exact checks of the required progressions.
- **Component** (jsdom, audio adapter mocked): panel playback state, key /
  voicing / register / variant controls, keyboard interaction, exercise
  flows, navigation and hashes, settings persistence and reset, desktop
  gate, and real VexFlow rendering of the score overlays.
- **End-to-end** (Playwright, Chromium, 1440×900): page load without errors,
  navigation, live playback with visual advance and clean stop,
  transposition, voicing, analysis visibility, exercises, preference
  persistence across reload, the narrow-viewport notice, and the
  upper-structure explorer.

## Deployment

Intentionally not configured. There is no CI workflow, no GitHub Pages, no
hosting config — the repository builds a static `dist/` and how it is served
is left to the consumer. (This was a project requirement, not an oversight.)

## Third-party assets

See [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md) for the piano
sample attribution (Salamander Grand Piano V3, CC BY 3.0).

## Known limitations

- The synth fallback, while pleasant, is not a substitute for the sampled
  piano in timbre; it exists for resilience.
- Exercise state intentionally resets on reload (no persistence by design).
- E2E tests run against Chromium only, mirroring the primary-browser policy.
