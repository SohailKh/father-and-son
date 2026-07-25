# Design assets

Source files for images used on the site. **Nothing here is deployed** — only
`public/` is copied into the build output, so anything placed in `public/` is
publicly downloadable whether or not a page references it.

Keep originals here and commit the exported, compressed version to `public/`.

| File | Exported to |
| --- | --- |
| `father-son-team-original.HEIC` | `public/father-son-team.jpg`, `public/team-father.jpg`, `public/team-son.jpg` |

`public/og-image.png` is rendered from `public/og-image.svg` at exactly
1200×630 with `deviceScaleFactor: 1`. Rendering at a higher scale factor
clips the design instead of scaling it.
