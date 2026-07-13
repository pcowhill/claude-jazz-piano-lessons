import type { ComponentType } from 'react'
import { Lesson01 } from './Lesson01'
import { Lesson02 } from './Lesson02'
import { Lesson03 } from './Lesson03'
import { Lesson04 } from './Lesson04'
import { Lesson05 } from './Lesson05'
import { Lesson06 } from './Lesson06'
import { Lesson07 } from './Lesson07'
import { Lesson08 } from './Lesson08'
import { Lesson09 } from './Lesson09'
import { Lesson10 } from './Lesson10'

export const LESSON_COMPONENTS: Record<string, ComponentType> = {
  'melody-harmony': Lesson01,
  'diatonic-harmony': Lesson02,
  'extensions-alterations': Lesson03,
  'secondary-dominants': Lesson04,
  'tritone-substitutions': Lesson05,
  'modal-interchange': Lesson06,
  modulation: Lesson07,
  'diminished-systems': Lesson08,
  'sixth-diminished': Lesson09,
  reharmonization: Lesson10,
}
