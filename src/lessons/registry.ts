export interface LessonMeta {
  number: number
  /** Stable URL hash, e.g. 'secondary-dominants'. */
  id: string
  title: string
  /** Compact name for the header index. */
  short: string
}

export const LESSONS: readonly LessonMeta[] = [
  { number: 1, id: 'melody-harmony', title: 'Melody, Harmony, and Voice Leading', short: 'Voice leading' },
  { number: 2, id: 'diatonic-harmony', title: 'Diatonic Harmony and Functional Progressions', short: 'Diatonic harmony' },
  { number: 3, id: 'extensions-alterations', title: 'Seventh Chords, Extensions, and Alterations', short: 'Extensions' },
  { number: 4, id: 'secondary-dominants', title: 'Secondary Dominants', short: 'Secondary dominants' },
  { number: 5, id: 'tritone-substitutions', title: 'Tritone Substitutions', short: 'Tritone subs' },
  { number: 6, id: 'modal-interchange', title: 'Modal Interchange and Borrowed Chords', short: 'Borrowed chords' },
  { number: 7, id: 'modulation', title: 'Tonicization and Modulation', short: 'Modulation' },
  { number: 8, id: 'diminished-systems', title: 'Diminished Systems: Chords, Scales, Dominants, and Modulation', short: 'Diminished systems' },
  { number: 9, id: 'sixth-diminished', title: 'Barry Harris–Style Sixth-Diminished Harmony', short: 'Sixth-diminished' },
  { number: 10, id: 'reharmonization', title: 'Reharmonization and Practical Application', short: 'Reharmonization' },
]

export function lessonById(id: string): LessonMeta | undefined {
  return LESSONS.find((lesson) => lesson.id === id)
}
