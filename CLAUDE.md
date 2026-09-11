# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Project Overview

Website for music artist [oddhorse](https://odd.horse). Static site built with 11ty
(Eleventy) and Nunjucks templates. The homepage is a list of "artifacts" — links to
songs, PDFs, sub-pages and jokes — wrapped in a lot of deliberately silly interactivity
(per-letter audio, a stampede, chaotic hover effects, rotating taglines).

The playful interactive code *is* the point of this site. Don't optimise it away.

## Development Commands

**Package manager: Bun.** All commands use `bun run`.

- `bun run build` — build to `dist/`
- `bun run serve` / `bun run start` — build and serve locally with live reload
- `bun run watch` — build and watch without serving
- `bun run clean` — remove `dist/`
- `bun run bench` — build with Eleventy benchmark output

No test suite or linter is configured.

### Git Worktrees

Worktree directory: `.worktrees/` (gitignored).

**Gotcha:** always run `git worktree add` from the **main repo root**. If you `cd` into a
worktree to run `bun install`, `cd` back before creating the next one, or worktrees nest
inside each other instead of becoming siblings.

```bash
# RIGHT - siblings
git worktree add .worktrees/branch-a -b branch-a
git worktree add .worktrees/branch-b -b branch-b
cd .worktrees/branch-a && bun install
```

## Architecture

Plain CSS and native ES modules — no preprocessing, no bundling, no build step beyond
11ty itself. Modern browser features are used directly.

### Files

```
src/
  index.njk  treats.njk  shop.njk  404.njk  1.njk  sitemap.xml.njk
  _layouts/base.njk            page shell
  _includes/                   head, header, logo, footer, modals,
                               background, beta-menu, mailchimp, gtag, icons/
  _data/                       artifacts, links, taglines, meta
  artifacts/                   artifact content (md, pdf, standalone pages)
  assets/css/
    main.css                   entry point; imports reset + global
    reset.css                  UNTOUCHABLE browser normalisation (modern-normalize)
    global.css                 tokens, fonts, semantic elements, header/footer/logo
    pages/index.css            homepage: artifact list, stampede, modals, chaos hover
    pages/treats.css           treats page layout
  assets/js/
    core.js                    loaded on ALL pages -> logo-hover, modals
    logo-hover.js              delegated logo tinting (see below)
    logo.js                    logo component behaviour, self-initialising
    modals.js                  modal open/close
    homepage.js                loaded on index.njk only -> everything below
    artifacts.js  stampede.js  chaos-hover.js  audio.js
    background.js              canvas horses (currently disabled in index.njk)
    beta-menu.js               dev tools, beta branch only
```

### Loading strategy

Pages pull in what they need with plain tags — there is no bundler and no manifest.

- Every page: `main.css` + `core.js` (via `head.njk`)
- Homepage only: `pages/index.css` + `homepage.js` (which preloads ~1.2MB of audio)
- Treats only: `pages/treats.css`

**Where does new code go?** Used everywhere → `global.css` / `core.js`. Used on one page
→ `pages/<page>.css` / `<page>.js`. Self-contained component → inline in that component's
`.njk` (wrap inline scripts in an IIFE). Needs to run before first paint → inline
non-module script in `head.njk`.

### The logo component

`_includes/logo.njk` is drop-in. Include it anywhere, any number of times:

```njk
{% include "logo.njk" %}                              full logo + tagline
{% set logoTagline = false %}{% include "logo.njk" %} logo, no tagline
{% set logoMark = true %}{% include "logo.njk" %}     just the horse mark
```

**Sizing is font-size and nothing else.** Everything inside is in `em`, so one
number scales the whole thing: `.hero .logo-container { font-size: 8rem; }`.
There is deliberately no `header .logo-container` size rule — one used to exist
and silently outranked every page-level override.

The tagline is `max(1rem, 0.157em)`: it scales with the logo but stops shrinking
at 1rem, so small logos keep a readable tagline without a mobile override.

`logo.js` finds every `.logo-container` and wires each independently — per-logo
tagline state, per-logo letter handlers. Audio is the one shared thing: `audio.js`
is a module singleton, so N logos still means one AudioContext and one download
of each clip. Clips preload after the page's `load` event, in idle time, and only
for letters actually on the page (a mark-only logo fetches one clip, not nine).

**Audio gotcha:** click handlers must call `playAudio()` synchronously. Browsers
only allow audio to start inside a user gesture, and any `await` before playing
leaves that gesture — the context stays suspended and the click is silent (the
tab may even show an audio icon). Check `hasAudio(key)` and play immediately.

### The colour system

One idea, used everywhere: **an element declares its colour once as `--hover-color`.**

CSS uses that variable to colour the element itself, and `logo-hover.js` reads the same
variable to tint the logo on hover. `logo-hover.js` uses a single delegated listener on
`document`, so elements added at runtime (the beta menu's dummy artifacts) work with no
re-binding. To make a new element type tint the logo, give it `--hover-color` and add its
selector to `HOVER_SELECTOR`.

Page colour comes from `color:` in frontmatter, set as `--page-color` by an inline script
in `head.njk` before first paint. `--link-hover-color` is derived from it **in CSS** using
relative color syntax. Note `l` resolves to a *number* there, so it is `calc(l - 10)` —
`calc(l - 10%)` silently fails and leaves the colour unset.

### Deployment

GitHub Actions, build with Bun and rsync to the server. `main` → production,
`beta` → beta server. A husky pre-commit hook keeps the beta version pinned to main's.

## Code Standards

### Verbose commenting

All code explains **intent**, not mechanics.

- **CSS** — `/** filename.css` header; `/* ===== SECTION ===== */` banners; a short
  `/* why */` above non-obvious selectors and magic numbers.
- **JavaScript** — file-level JSDoc saying what the file initialises or exports;
  `@param`/`@returns` on functions; inline comments explain *why*, never *what*.
- **Nunjucks** — `{# ... #}` for template logic, loops and conditionals.

```javascript
/**
 * artifacts.js
 * Tracks which artifacts have been clicked, in localStorage,
 * so visitors can see what they have already explored.
 */
```

### Semantic HTML

Real elements (`<header>`, `<footer>`, `<nav>`, `<main>`, `<article>`). Minimal markup —
no div soup, no utility classes like `.text-center`. Class names describe purpose
(`.artifact-list`, not `.flex-col`). ARIA where it earns its place.

### CSS

Mobile-first, with `@media` for larger screens. Custom properties for anything reused.
Modern features (`clamp()`, `calc()`, `:is()`, `:has()`, nesting, relative colors) are
fair game — browsers handle them natively and there is no build step to care about.

## Gotcha: transforms and scrollable overflow

Transformed elements can extend past their layout box and add to the document's
scrollable area, causing stray scrollbars. `overflow: hidden` won't help — it clips
children, not the element's own transform — and `contain: paint` clips the visual
too. Use `contain: layout` with `overflow: visible`:

```css
.element-with-wild-transforms {
	contain: layout;   /* keep transformed bounds out of scroll calculation */
	overflow: visible; /* but still let them render outside the box */
}
```

If you genuinely need to clip children, move the transform onto an inner wrapper instead.
