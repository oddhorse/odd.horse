# artifacts dir

this directory is for artifacts

artifacts list is registered in `/src/_data/artifacts.json`

```json
{
  "id": "my-artifact",
  "description": "Description shown to visitors",
  "url": "/artifacts/my-file.pdf",
  "type": "pdf",
  "tags": ["music", "blog"],
  "dateAdded": "2025-12-31",
  "color": "#ff00bb",
  "image": "/assets/images/artifacts/my-artifact.png",
  "imageAlt": "what the picture shows"
}
```

### fields

| field | required | what it does |
| --- | --- | --- |
| `id` | yes | unique key, also what click tracking remembers in localStorage |
| `description` | yes | the text shown in the list |
| `url` | yes | where it goes. `#` for something handled in JS, like STAMPEDE |
| `dateAdded` | yes | `YYYY-MM-DD`. sorts the list, and drives the NEW! badge for 30 days |
| `color` | no | the artifact's colour. tints the logo on hover. defaults to `#ff00bb` |
| `type` | no | the *format*: `pdf`, `link`, `text` |
| `tags` | no | the *content*: `["music"]`, `["blog"]`. see below |
| `image` | no | path to a picture. see below |
| `imageAlt` | no | description of the picture, for screen readers |
| `newtab` | no | `true` opens in a new tab |
| `hidden` | no | `true` keeps it off the homepage entirely |

`type` is the file format, `tags` is what it's *about*, so a thing can be a
`"pdf"` tagged `["music"]`. Both are free-form, nothing validates them.

### tags and images

Neither is drawn on the page yet. They are emitted onto each list item as
`data-tags` and `data-image`, ready for the particle system to read, so each
kind of artifact can throw off its own particles.

Tags are written out space-separated, which means CSS can already target one
without any JavaScript:

```css
.artifact-item[data-tags~="music"] { /* ... */ }
```

For that to work each tag has to be a single word, so use `field-recording`
rather than `field recording`. Any number of tags per artifact is fine.

Images go in `/src/assets/images/artifacts/` and are referenced by full path
from the site root. That folder is copied to the built site as-is.

## contained sites

a folder in `sites/` is a whole self-contained site (its own html, css, js), like `sites/church/`

it gets copied untouched to `/artifacts/<name>/` — the `sites` part never shows up in the url, so church's `url` is just `/artifacts/church`

each one is a git submodule of its own standalone repo, so don't edit it here. change the real repo and push; the next deploy of this site picks up its latest main (`bun run sync:artifacts` does the same locally)

rules for a contained site:

- relative urls only (`images/x.png`, not `/images/x.png`)
- can't share a name with a loose artifact in this folder
