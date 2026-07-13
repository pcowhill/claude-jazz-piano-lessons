// Hero, legend, sources and footer — the static frame around the lessons.

export function Hero() {
  return (
    <div className="hero" id="top">
      <div className="prose">
        <p className="hero__kicker">An interactive reference for intermediate pianists</p>
        <h1 className="hero__title">Jazz Piano Theory Atlas</h1>
        <p className="hero__subtitle">
          A fast, interactive reference for hearing jazz harmony at the keyboard.
        </p>
        <p className="hero__body">
          Ten compact lessons move from voice leading to reharmonization, each built around
          playable examples: notation above, keyboard below, analysis on demand. Transpose
          anything to any key, flip between plain and idiomatic voicings, and let your ear —
          not just the page — do the learning. Audio starts with your first click on a play
          button or piano key.
        </p>
      </div>
    </div>
  )
}

export function Legend() {
  return (
    <div className="legend prose" aria-label="Notation and interaction legend">
      <h2 className="legend__title">How to read the panels</h2>
      <dl className="legend__grid">
        <div>
          <dt>Chord symbols · Roman numerals</dt>
          <dd>
            Symbols like <code>D7/F♯</code> sit above the staff; the functional reading
            (<code>V/V</code>, <code>♭II7</code>) sits below it. The Settings toggle hides the
            analysis layer if you want to test your ear first.
          </dd>
        </div>
        <div>
          <dt>Play · Key · Register</dt>
          <dd>
            Every example plays in all 12 keys. <em>Key</em> transposes the harmony;
            <em> Register</em> only shifts the sounding octave. Only one example plays at a
            time.
          </dd>
        </div>
        <div>
          <dt>Clear vs. Jazz voicing</dt>
          <dd>
            <em>Clear</em> spells chords plainly so structure is easy to see;
            <em> Jazz</em> switches to idiomatic shells, rootless shapes and smoother voice
            leading. Same harmony, different hands.
          </dd>
        </div>
        <div>
          <dt>The keyboard</dt>
          <dd>
            Keys light up (pale blue) and dip while they sound. Click any key to hear it —
            the keyboard is always live. Small dots mark scale tones in scale-aware panels.
          </dd>
        </div>
        <div>
          <dt>Accidentals</dt>
          <dd>
            Spelling follows harmonic function: expect <code>C♭</code> or <code>E♭♭</code>{' '}
            (double flat, written here as ♭♭) where the analysis requires them. The Analyze
            panel always names what such notes sound as in equal temperament.
          </dd>
        </div>
        <div>
          <dt>Exercises</dt>
          <dd>
            Small prompts with a hint, immediate feedback and a revealable explanation.
            Nothing is scored or saved — they reset on reload.
          </dd>
        </div>
      </dl>
    </div>
  )
}

interface Source {
  id: string
  text: string
}

export const SOURCES: readonly Source[] = [
  { id: 'levine-theory', text: 'Mark Levine, The Jazz Theory Book (Sher Music Co.) — tensions, chord-scale relationships, the diminished family.' },
  { id: 'levine-piano', text: 'Mark Levine, The Jazz Piano Book (Sher Music Co.) — voicing practice: shells, rootless voicings, left-hand technique.' },
  { id: 'terefenko', text: 'Dariusz Terefenko, Jazz Theory: From Basic to Advanced Study, 2nd ed. (Routledge) — functional analysis, tonicization and modulation.' },
  { id: 'berklee-harmony', text: 'Joe Mulholland & Tom Hojnacki, The Berklee Book of Jazz Harmony (Berklee Press) — modal interchange, secondary dominants, substitute dominants.' },
  { id: 'pease', text: 'Ted Pease, Jazz Composition: Theory and Practice (Berklee Press) — melodic/harmonic relationships and reharmonization craft.' },
  { id: 'kingstone', text: 'Alan Kingstone, The Barry Harris Harmonic Method for Guitar (Jazzworkshop Productions) — a secondary presentation of Barry Harris–associated sixth-diminished practice.' },
  { id: 'berklee-ust', text: 'Berklee educational material on upper-structure triads — organizing dominant tensions as triads over a foundation.' },
]

export function Sources() {
  return (
    <section className="sources prose" id="sources" aria-labelledby="sources-title">
      <h2 id="sources-title">Sources &amp; further study</h2>
      <p className="sources__note">
        The explanations here are original summaries written for this atlas; these standard
        references ground the terminology and go far deeper than a quick reference can.
        Where naming conventions differ between traditions (octatonic scale names, tension
        labels, “sixth-diminished” vocabulary), the lessons say so rather than pretending one
        usage is universal.
      </p>
      <ul className="sources__list">
        {SOURCES.map((source) => (
          <li key={source.id}>{source.text}</li>
        ))}
      </ul>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="prose">
        <p>
          <strong>Jazz Piano Theory Atlas.</strong> All musical examples, melodies,
          progressions and voicings on this page are original material written for this
          reference. Generic harmonic devices (ii–V–I, twelve-bar form, rhythm-changes-style
          functions) are discussed as common practice; no copyrighted tunes, lead sheets or
          solos are quoted.
        </p>
        <p className="footer__fine">
          Piano samples: Salamander Grand Piano V3 by Alexander Holm (CC BY 3.0) — see
          THIRD_PARTY_NOTICES.md in the repository. Built with React, Tone.js and VexFlow.
          Desktop only, fully offline after load, no accounts, no tracking.
        </p>
      </div>
    </footer>
  )
}
