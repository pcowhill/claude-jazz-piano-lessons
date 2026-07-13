# Third-Party Notices

## Salamander Grand Piano (audio samples)

The piano samples bundled at `public/samples/salamander/` are a sparse subset
(21 notes, single velocity layer, MP3) of the **Salamander Grand Piano V3**
sample set.

- **Author:** Alexander Holm
- **License:** Creative Commons Attribution 3.0 Unported (CC BY 3.0)
  — <https://creativecommons.org/licenses/by/3.0/>
- **Original distribution:** <https://archive.org/details/SalamanderGrandPianoV3>
  (archive.org item metadata lists the license URL above and Alexander Holm as
  creator)
- **This subset:** the trimmed MP3 conversions published by the Tone.js project
  for its documentation examples (<https://tonejs.github.io/audio/salamander/>),
  which are derived from the same CC BY 3.0 source recordings.

### Attribution statement

> Salamander Grand Piano V3 by Alexander Holm, licensed under CC BY 3.0.
> Yamaha C5 recorded at 48 kHz / 24 bit, sampled in minor thirds.

### Changes made

- Only 21 of the original sample files are included (minor-third spacing from
  C1 to C7); intermediate pitches are produced at runtime by playback-rate
  transposition.
- The included files are the MP3-converted, trimmed versions rather than the
  original 48 kHz WAV recordings.
- No other processing was applied by this project.

## Runtime libraries

Runtime npm dependencies (React, Tone.js, VexFlow) are used under their own
licenses (MIT); see each package's `LICENSE` file in `node_modules/` or its
repository. They are compiled into the application bundle and are not
redistributed as source by this repository.
