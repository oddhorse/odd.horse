# artifacts dir

this directory is for artifacts

artifacts list is registered in `/src/_data/artifacts.json`

```json
{
  "id": "my-artifact",
  "description": "Description shown to visitors",
  "url": "/artifacts/my-file.pdf",
  "type": "pdf",
  "dateAdded": "2025-12-31",
  "color": "#ff00bb"
}
```

## contained sites

a folder in `sites/` is a whole self-contained site (its own html, css, js), like `sites/church/`

it gets copied untouched to `/artifacts/<name>/` — the `sites` part never shows up in the url, so church's `url` is just `/artifacts/church`

each one is a git submodule of its own standalone repo, so don't edit it here. change the real repo and push; the next deploy of this site picks up its latest main (`bun run sync:artifacts` does the same locally)

rules for a contained site:

- relative urls only (`images/x.png`, not `/images/x.png`)
- can't share a name with a loose artifact in this folder
