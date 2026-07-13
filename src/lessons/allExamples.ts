// Aggregates every authored example so tests can audit the full catalogue.

import type { ExampleSpec } from '../music/example'
import { oneMelodyTwoHarmonies, guideTones251 } from './Lesson01'
import { diatonicLadder, oneSixTwoFive } from './Lesson02'
import { layering, tensions251 } from './Lesson03'
import { walkUp, chain } from './Lesson04'
import { subCompare, chromaticDescent } from './Lesson05'
import { borrowedIv, flatSixSeven } from './Lesson06'
import { cToEflat, touristVsMover } from './Lesson07'
import { dominantFamily, passingDim, commonToneAndPivot, octatonicScales } from './Lesson08'
import { majorLadder, minorLadder, melodyMovement, staticVsMoving } from './Lesson09'
import { beforeAfter } from './Lesson10'

export const ALL_EXAMPLES: readonly ExampleSpec[] = [
  oneMelodyTwoHarmonies,
  guideTones251,
  diatonicLadder,
  oneSixTwoFive,
  layering,
  tensions251,
  walkUp,
  chain,
  subCompare,
  chromaticDescent,
  borrowedIv,
  flatSixSeven,
  cToEflat,
  touristVsMover,
  dominantFamily,
  passingDim,
  commonToneAndPivot,
  octatonicScales,
  majorLadder,
  minorLadder,
  melodyMovement,
  staticVsMoving,
  beforeAfter,
]
