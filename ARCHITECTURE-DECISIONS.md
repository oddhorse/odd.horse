# Architecture Decisions & Refactoring Plan
**Date:** 2026-01-04
**Status:** Planning phase - decisions documented, implementation pending

## Table of Contents
1. [Core Design Philosophy](#core-design-philosophy)
2. [Artifact Types & Requirements](#artifact-types--requirements)
3. [Navigation & UX Decisions](#navigation--ux-decisions)
4. [Current Architecture Analysis](#current-architecture-analysis)
5. [Problems Identified](#problems-identified)
6. [WebC Migration Research](#webc-migration-research)
7. [Next Steps](#next-steps)

---

## Core Design Philosophy

### Immersion-First Design
The site prioritizes **immersion over traditional navigation** for artifact pages. Key principles:

- **Homepage as gallery hub** - curated index of artifacts
- **Artifacts as experiences** - each opens in new tab, fully immersive
- **Minimal chrome** - no site-wide header/footer on artifacts
- **Non-visual navigation** - keyboard shortcuts (ESC to close), semantic HTML, browser UI
- **Artistic freedom** - each artifact defines its own visual language

This aligns with:
- Gallery/museum UX (you don't see nav menus inside a painting)
- Music player apps (Spotify/SoundCloud focus on audio experience)
- Experimental web art (XXIIVV, Hundred Rabbits, etc.)

**Trade-offs accepted:**
- ✅ GAIN: Artifacts can be truly unique, cleaner code, faster load, artistic freedom
- ❌ GIVE UP: Discoverability between artifacts, traditional SEO internal linking, conversion paths

---

## Artifact Types & Requirements

### 1. External Links
- **Examples:** Bandcamp, SoundCloud, YouTube
- **Behavior:** Click → open external site in new tab
- **Template needed:** No (handled by artifacts.json)
- **UX:** External sites provide their own chrome

### 2. PDFs
- **Examples:** Zines, liner notes, artwork, scans
- **Behavior:** Click → open PDF in new tab (browser native viewer)
- **Template needed:** No (direct file link)
- **UX:** Browser handles UI

### 3. Markdown Blog Posts
- **Examples:** Written content, essays, updates
- **Behavior:** Click → rendered HTML page in new tab
- **Template needed:** YES - blog post template
- **Requirements:**
  - Minimal, experimental/ironic aesthetic (not "professional blog")
  - Back button (no breadcrumb - title is at top of post)
  - NO ESC functionality
  - Unified blog styling
  - Width-reduced layout, intentionally simple
  - Possible visual elements: wood desk with horse faces, fake-glitchy Medium clone, "from the desk of oddhorse" letterhead, stupid photos, bad TTS widget
- **UX:** No list/index page - posts linked from homepage artifacts list only

### 4. Interactive Artifacts
- **Examples:** 3D render + music, interactive games, generative art
- **Behavior:** Click → custom HTML page in new tab
- **Template needed:** YES - but each is unique/custom
- **Requirements:**
  - Custom HTML/JS/CSS per artifact
  - Head tag for dependencies (Three.js, p5.js, etc.)
  - Optional breadcrumb (only if title not clearly shown in artifact)
  - ESC/back functionality (with flag to disable if needed)
- **UX:** Fully immersive, experimental, unique per artifact

### 5. Utility Pages (Future)
- **Examples:** Stats page (if tracking implemented)
- **Template needed:** TBD based on implementation

---

## Navigation & UX Decisions

### Homepage
- Serves as gallery/portal hub
- Lists all artifacts with click tracking (localStorage)
- Full site chrome (header, footer, navbar, modals)
- Opens artifacts in new tabs

### Artifact Pages - Navigation Elements

#### Breadcrumb (Conditional)
- **When to show:** Only on artifacts where title isn't clearly stated at top
- **Behavior:**
  - Fades away after initial view
  - Gets clearer when cursor approaches (proximity fade)
  - Always visible on mobile (no hover state)
- **Format:** "oddhorse / artifacts / artifact-name"
- **Blog posts:** NO breadcrumb (title already at top)

#### Back Button / ESC Key
- **Mechanism:** Should CLOSE the tab (not navigate back)
- **Where:**
  - Blog posts: Back button only (no ESC)
  - Interactive artifacts: ESC + optional back button (flag to disable)
- **Implementation:** Flag to toggle ESC functionality per page

#### Semantic HTML Escape Hatches
- `<title>` tag: "Artifact Name - oddhorse"
- `<link rel="canonical">` or `<meta>` pointing to homepage
- Keyboard shortcuts (ESC to close tab)
- Subtle corner icon on hover (optional)

**Tab navigation already working on site** - ESC key can be mapped to homepage return

---

## Current Architecture Analysis

### Template Structure
```
base.njk (minimal HTML wrapper)
  ├─ head.njk (all site CSS/JS loaded here)
  └─ body
      └─ {{ content }} (page content)

Pages (e.g., index.njk):
  - Use layout: base
  - Manually {% include "header.njk" %} where needed
  - Manually {% include "footer.njk" %} where needed
  - Inline <style> for page-specific CSS
  - Inline <script> for page-specific JS
```

**Current includes:**
- `background.njk` (commented out on homepage)
- `modals.njk`
- `beta-menu.njk`
- `gtag.njk`
- `header-logo.njk`
- `header.njk`
- `head.njk`
- `footer.njk`

### CSS Architecture (Current)
**Loaded on EVERY page via head.njk:**
```
main.css (entry point)
  ├─ reset.css (browser normalization - ~200 lines)
  └─ global.css (ALL site styles - ~900 lines)
      ├─ CSS custom properties (colors, transitions, animations)
      ├─ Font-face declarations (Karrik)
      ├─ Semantic HTML base styles (a, p, h1, body, etc.)
      ├─ Page structure (sticky footer, flexbox layout)
      ├─ Header styles
      ├─ Footer styles
      ├─ Navbar styles
      ├─ Background container
      ├─ Logo container
      ├─ Utility classes (.oddhorse-inline, .emoticon, .darker)
      ├─ Animations (floatUpDown, fadeOutSustain, hoverwink)
      └─ Modal system
```

**Page-specific CSS:**
- Inline `<style>` tags in templates
- Example: index.njk has ~200 lines of artifact list styles

### JavaScript Architecture (Current)
**Loaded on EVERY page via head.njk:**
```
main.js (entry point)
  ├─ navbar.js (logo hover color effects)
  ├─ colors.js (derives hover colors from page color)
  └─ modals.js (contact and links popups)
```

**Page-specific JS:**
- `artifacts.js` - imported only in index.njk (click tracking)
- Inline `<script type="module">` in templates:
  - background.njk (~250 lines canvas animation)
  - header-logo.njk (~90 lines tagline rotation)
  - beta-menu.njk (~100 lines dev tools)

---

## Problems Identified

### 1. CSS Over-Loading
**Problem:** Every page loads ~900 lines of global.css, including:
- ✗ Navbar styles (not needed on artifacts without navbar)
- ✗ Footer styles (not needed on artifacts without footer)
- ✗ Modal system (not needed on artifacts without modals)
- ✗ Animations (maybe not needed on all artifacts)

**Impact:** Minimal blog post or 3D artifact loads CSS for features it doesn't have

**What SHOULD load:**
- Homepage: Everything
- Blog posts: reset.css, fonts, base HTML styles, blog-specific styles
- Interactive artifacts: reset.css (maybe), artifact-specific CSS only

### 2. JavaScript Over-Loading
**Problem:** Every page loads navbar.js, colors.js, modals.js
- Pages without navbar load navbar hover effects
- Pages without modals load modal system
- ~200+ lines of unused JS

**Impact:** Performance overhead for minimal pages

### 3. Monolithic global.css
**Problem:** Single 900-line file contains everything from fonts to modals
- Hard to reason about what's needed where
- Can't load subsets for different page types
- Desire to split has existed for a while

**Desired split:**
- `reset.css` ✓ (already separate)
- `fonts.css` (extract from global)
- `base-html.css` (semantic HTML styles - truly global)
- `custom-properties.css` (CSS variables - truly global)
- `components/navbar.css` (only load on pages with navbar)
- `components/footer.css`
- `components/modals.css`
- `components/header.css`
- `animations.css` (only load where needed)

### 4. Mental Model Mismatch
**Problem:** Current architecture is "one big page" approach
- All CSS/JS in head, plus inline page-specific code
- Hard to think in "enclosed units" or components
- Want co-located CSS/JS with HTML (component mindset)

**Desired:** Modular components where each component file contains:
- HTML structure
- CSS specific to that component
- JS specific to that component
- Build process bundles only what's used per page

---

## WebC Migration Research

### Migration Approaches

#### 1. Incremental Migration (Recommended)
- Use Eleventy Render plugin to embed WebC in Nunjucks
- Migrate components one at a time
- Wrap Nunjucks code in WebC: `<template webc:type="11ty" 11ty:type="njk">`
- Test after each component conversion

#### 2. Transform Mode (Fast Setup, Slow Performance)
- Catch-all option processes all .html output files
- **WARNING:** Disables bundler mode - CSS/JS won't aggregate!
- Slowest build performance
- Useful for quick testing, not production

#### 3. Full Rewrite (High Risk)
- Convert all templates at once
- Most error-prone
- What was tried yesterday - failed due to compounding errors

### Common WebC Pitfalls (What Failed Yesterday)

#### 1. CSS Bundling Configuration
**Problem:** Transform mode disables bundler → CSS doesn't load
**Solution:** Use component mode with bundler explicitly enabled in eleventy.config.js

#### 2. Component Registration
**Problem:** WebC doesn't auto-discover components by default
**Solution:** Explicitly configure components directory path

#### 3. HTML Parser Issues
**Problem:** Components in `<head>` get moved to `<body>` by HTML parser
**Solution:** Use `webc:is` attribute instead of custom elements in `<head>`

#### 4. Syntax Gotchas
- **No self-closing tags:** `<my-component />` breaks, must use `<my-component></my-component>`
- **Slot line breaks:** A line break counts as slot content, prevents default from showing
- **No Nunjucks syntax:** Must rewrite loops, conditionals to WebC syntax
- **Can't use Liquid/Nunjucks directly:** Need `webc:type` wrapper

#### 5. Path Configuration
- If input directory is customized, component paths are **root-relative** not input-relative
- Components outside `_includes` need build ignore configuration

### What Went Wrong Yesterday
1. **Used transform mode or didn't configure bundler** → CSS didn't aggregate
2. **Syntax errors in component definitions** → components didn't compile (stayed as `<component>` tags in HTML)
3. **One-shot migration hit multiple issues** → compounding errors, site broken
4. **VSCode chat interface** → agents might not have been properly invoked

### Better Approach for WebC Migration
1. Use **component mode with bundler enabled**
2. Migrate **incrementally** - one component at a time
3. Use `webc:type="njk"` wrapper for complex Nunjucks logic during transition
4. **Test bundler works** with ONE component before migrating more
5. Use CLI agents (not VSCode chat) for proper agent invocation

### Migration Phases (When We Do This)
1. **Phase 1: Setup & one test component**
   - Install WebC plugin
   - Configure eleventy.config.js (bundler mode, component paths)
   - Migrate ONE simple component (e.g., footer.njk → footer.webc)
   - Verify it compiles and CSS extracts correctly
   - **STOP and test before continuing**

2. **Phase 2: Migrate remaining includes**
   - Convert header, navbar, modals one at a time
   - Test after each one

3. **Phase 3: Migrate layouts**
   - Convert base.njk to base.webc
   - Test

4. **Phase 4: Migrate pages**
   - Convert index.njk, other pages
   - Test each one

### Alternative: Bundle Plugin
**Package:** `@11ty/eleventy-plugin-bundle`

**How it works:**
```njk
{# In page or component #}
{% css %}
  .artifact-list { padding: 2rem; }
{% endcss %}

{% js %}
  import { trackClicks } from './artifacts.js';
{% endjs %}

{# In head.njk #}
<style>{% getBundle "css" %}</style>
<script type="module">{% getBundle "js" %}</script>
```

**Benefits:**
- Works with existing Nunjucks templates
- Incremental adoption (add `{% css %}` blocks gradually)
- Per-page bundling (each page only gets what it declares)
- Less invasive than WebC migration

**Trade-offs vs WebC:**
- ✅ Lower migration risk
- ✅ Keep Nunjucks for complex logic
- ❌ Less clean than WebC component model
- ❌ Not true co-located components (still template blocks)

**Decision:** User prefers WebC for cleaner component model, will migrate with agent support

---

## Next Steps

### Remaining Architectural Discussions
1. JavaScript loading optimization (same problem as CSS, same solution)
2. Monolithic page problem (summarize pain points)
3. WebC as solution (confirm approach)
4. WebC refactoring effort (detailed plan with agents)
5. Alternatives discussion (bundle plugin vs WebC - already covered)

### Before Migration
- [ ] Finish architectural discussions
- [ ] Complete this documentation
- [ ] Update CLAUDE.md with new architectural guidelines (or keep separate)

### Migration Preparation
- [ ] Invoke `webc-architecture-advisor` agent to create detailed migration plan
- [ ] Use `eleventy-webc-migrator` agent for step-by-step migration
- [ ] Use `webc-component-generator` agent to create components

### Immediate Tasks
- [ ] Split global.css into modular files (do BEFORE or DURING WebC migration?)
- [ ] Define truly global styles (custom properties, fonts, base HTML)
- [ ] Create blog post template with experimental aesthetic
- [ ] Implement breadcrumb with proximity fade
- [ ] Implement ESC key tab-close functionality

---

## Resources & References

### WebC Documentation
- [WebC in Eleventy](https://www.11ty.dev/docs/languages/webc/)
- [Understanding WebC Features](https://11ty.rocks/posts/understanding-webc-features-and-concepts/)
- [Adding Components to Eleventy with WebC](https://www.zachleat.com/web/webc-in-eleventy/)

### Migration Guides
- [Using WebC in 11ty](https://domwakeling.com/using-webc-in-11ty/)
- [WebC First Impressions](https://bennypowers.dev/posts/webc-impressions/)
- [Eleventy Common Pitfalls](https://www.11ty.dev/docs/pitfalls/)

### Agents Available for Migration
- `eleventy-webc-migrator` - handles step-by-step migration
- `webc-architecture-advisor` - creates migration strategy
- `webc-component-generator` - generates WebC components

---

## Final Decisions Summary

### ✅ Confirmed Approach: WebC Migration

**Why WebC over alternatives:**
- Matches component mental model (co-located HTML/CSS/JS)
- Automatic asset bundling per page
- Solves CSS/JS over-loading problem
- Official Eleventy component solution
- Enables splitting global.css into modular components

**Rejected alternatives:**
- ❌ Bundle plugin - less clean than WebC, doesn't fully solve component co-location
- ❌ Manual optimization with conditionals - doesn't solve mental model mismatch
- ❌ Other template languages - no better component model than WebC

### Migration Strategy

**Incremental approach with agent support:**
1. Use `webc-architecture-advisor` to create detailed migration plan
2. Use `eleventy-webc-migrator` for step-by-step migration
3. Use `webc-component-generator` for creating components
4. Migrate one component at a time, test after each
5. Start with simple component (footer) to verify bundler works
6. Work on separate branch with ability to revert

**Key configuration requirements:**
- Enable bundler mode (NOT transform mode)
- Configure component paths correctly
- Use `webc:is` for components in `<head>`
- No self-closing component tags
- Test CSS/JS bundling at each step

### JavaScript Loading Decision

**Custom per page** - each page loads only what it needs
- Homepage: navbar.js, colors.js, modals.js, artifacts.js
- Blog posts: blog-specific JS only
- Interactive artifacts: artifact-specific JS only
- Logo component: brings its own tagline rotation JS when included

### CSS Splitting Plan

**From monolithic global.css (~900 lines) to:**
```
_components/
├─ base.webc (reset, fonts, custom properties, base HTML - truly global)
├─ logo.webc (logo styles)
├─ navbar.webc (navbar styles)
├─ footer.webc (footer styles)
├─ modals.webc (modal system styles)
├─ breadcrumb.webc (breadcrumb with proximity fade)
└─ [other components as needed]
```

**Truly global styles** (loaded on every page):
- reset.css (browser normalization)
- Font declarations (Karrik)
- CSS custom properties (colors, transitions, animations)
- Base HTML semantic element styles (a, p, h1, body, etc.)

### Ready for Migration

All architectural decisions finalized. Ready to invoke agents for WebC migration when user is ready to proceed.
