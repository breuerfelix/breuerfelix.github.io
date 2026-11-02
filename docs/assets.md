# Vendored visual assets

Skills icons are the 20 used SVG variants from Devicon v2.18.0:
https://github.com/devicons/devicon/tree/v2.18.0/icons
They are rendered as CSS masks in the existing text color, preserving the icon-font appearance.
The upstream MIT license is included in `assets/icons/skills/LICENSE.txt`.

Only the active font faces are retained and served locally with `font-display: swap`:

- Roboto regular and bold, the existing Google Fonts v18 Latin WOFF2 files:
  `KFOmCnqEu92Fr1Mu4mxK.woff2` and `KFOlCnqEu92Fr1MmWUlfBBc4.woff2`.
  Source: https://fonts.gstatic.com/s/roboto/v18/
  License: Apache 2.0, included under `assets/fonts/licenses/`.
- Ubuntu Mono regular, the existing Google Fonts v9 Latin WOFF2 file:
  `KFOjCneDtsqEr0keqCMhbCc6CsQ.woff2`.
  Source: https://fonts.gstatic.com/s/ubuntumono/v9/
  License: Ubuntu Font License 1.0, included under `assets/fonts/licenses/`.

These are copies of the active font assets, without changing their design. Unused
Source Sans Pro faces and unused weights/styles are removed. No icon or font CDN
request is needed at runtime. `assets-manifest.json` records the vendored file hashes;
update the files and manifest together when deliberately refreshing these assets.
