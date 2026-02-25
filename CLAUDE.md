# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website for music artist [oddhorse](https://odd.horse), built as a static site using 11ty (Eleventy) with Nunjucks templates. The site features music releases, projects, blog posts, and various tools/utilities.

## Development Commands

**Package Manager:** This project uses **Bun** (not npm). All commands use `bun run`.

### Building and Serving

- `bun run build` - Build the static site to `dist/` folder
- `bun run serve` - Build and serve the site locally with live reload
- `bun run start` - Alias for serve
- `bun run watch` - Build and watch for changes without serving
- `bun run clean` - Clean the dist folder
- `bun run build-ghpages` - Build with GitHub Pages path prefix
- `bun run bench` - Run with benchmark debugging enabled

No test suite or linting is currently configured.

### Git Worktrees

**Worktree Directory:** `.worktrees/` (project-local, in .gitignore)

**CRITICAL GOTCHA:** When creating multiple worktrees, always run `git worktree add` from the **main repo root**, not from within another worktree. If you cd into a worktree to run `bun install`, cd back to the main repo before creating the next worktree, or they will nest inside each other instead of being siblings.

```bash
# WRONG - creates nested worktrees
git worktree add .worktrees/branch-a -b branch-a
cd .worktrees/branch-a && bun install
git worktree add .worktrees/branch-b -b branch-b  # Creates branch-a/.worktrees/branch-b!

# RIGHT - creates sibling worktrees
git worktree add .worktrees/branch-a -b branch-a
git worktree add .worktrees/branch-b -b branch-b
cd .worktrees/branch-a && bun install
cd ../branch-b && bun install
```

**Setup in each worktree:**
1. `cd .worktrees/<branch-name>`
2. `bun install` - Install dependencies
3. `bun run build` - Verify site builds
4. Ready to work!

## Architecture

### Site Generation (Eleventy)

- **11ty** handles static site generation with Nunjucks templating
- **Plain CSS** - no preprocessing, uses modern browser features natively
- **ES Modules** - JavaScript loaded natively by browser
- **11ty Bundle Plugin** - Consolidates inline `<style>` and `{% js %}` blocks into single output
- **eleventy.config.js** contains the main configuration including:
  - Direct asset copying (CSS and JS copied to dist as-is)
  - Image optimization with multiple formats (WebP, SVG, JPEG)
  - Git info injection for templates
  - Custom date parsing and filters

### Content Structure

- **Pages**: Top-level `.njk` files in `src/` (index, links, shop, contact)
- **Data**: `src/_data/artifacts.json` contains the artifact list for homepage
- **Templates**: Layouts in `src/_layouts/`, includes in `src/_includes/`

### Template System

- **Layouts**: `src/_layouts/` contains base templates
  - `base.njk` - Main layout with header/footer
- **Includes**: `src/_includes/` for reusable components (navbar, header-logo, footer, background)
- **Data**: `src/_data/` for global data (artifacts, links, meta, build info)

### Asset Pipeline

- **CSS**: Hybrid organization with global styles + page-specific files
  - **Global CSS** (loaded on ALL pages):
    - `main.css` - Entry point that imports reset and global
    - `reset.css` - ⚠️ UNTOUCHABLE browser normalization (modern-normalize)
    - `global.css` - Foundation styles (~647 lines)
      - CSS custom properties, fonts, semantic HTML base styles
      - Site-wide layout systems (sticky footer, flexbox)
      - Truly global components (header, footer, navbar)
      - Utility classes and reusable animations
  - **Page-specific CSS** (loaded only where needed):
    - `pages/index.css` - Homepage styles (~600 lines)
      - Flexbox centering layout, logo size override (7rem)
      - Artifact list with click tracking UI
      - Stampede overlay animations
      - Modal system (contact and links)
      - Chaos hover effects
    - `pages/treats.css` - Treats page styles (~25 lines)
      - Centered layout, logo size (6rem)
  - **Inline component styles** - Self-contained component CSS
    - `beta-menu.njk` - Beta menu component (~82 lines)
    - `background.njk` - Background canvas (~22 lines)
- **JavaScript**: Core + page-specific loading strategy
  - **Core JS** (loaded on ALL pages via head.njk):
    - `core.js` - Essential features (navbar, colors, modals)
    - `navbar.js` - Logo hover color effect
    - `colors.js` - Derives hover colors from page color
    - `modals.js` - Modal system initialization
  - **Page-specific JS** (loaded only on specific pages):
    - `homepage.js` - Homepage features (stampede, chaos, header-logo, audio)
      - Loaded only on index.njk
      - Includes audio preloading (9 files, ~500KB)
      - Initializes homepage-only interactive features
    - `artifacts.js` - Click tracking module (imported by homepage.js)
  - **Inline template scripts** - Component-specific JavaScript
    - `index.njk` - Artifact tracking initialization
    - `background.njk` - Canvas animation (~250 lines, IIFE)
    - `header-logo.njk` - Tagline rotation (~90 lines, IIFE)
    - `beta-menu.njk` - Dev tools (~100 lines, IIFE)
- **Modern CSS Features**: Custom properties (variables), clamp(), calc(), modern selectors, :has()
- **Loading Strategy**: Pages specify their CSS/JS via `<link>` and `<script>` tags in templates

### Deployment

- **GitHub Actions** handle automated deployment
- **Main branch** → Production server via SSH/rsync
- **Beta branch** → Beta server for testing
- Inline CSS/JS bundled at build time via 11ty bundle plugin

## Code Standards

### Verbose Commenting Requirements

ALL code must have detailed comments explaining INTENT, not just implementation.

#### CSS

- **File-level**: `/** FILENAME description */` at the top of each file
- **Section-level**: `/* ===== SECTION ===== */` with explanation of purpose
- **Rule-level**: `/* Why this rule exists */` before complex selectors
- **Inline**: `/* Why this specific value */` for non-obvious property values

Example:

```css
/**
 * components.css
 * Reusable UI components and utilities
 */

/* ===== LOGO CONTAINER =====
 * Text logo with inline SVG
 * Logo color controlled by --logo-color variable (changed by navbar.js on hover)
 */
.logo-container {
 /* Center logo and tagline vertically */
 display: flex;
 flex-direction: column;
 align-items: center;
}
```

#### JavaScript

- **File-level JSDoc**: Describe file's purpose and what it initializes/exports
- **Function JSDoc**: Include `@param` and `@returns` for all functions
- **Inline comments**: Explain WHY for complex logic, not WHAT (code should be self-documenting)

Example:

```javascript
/**
 * artifacts.js
 * Handles artifact click tracking using localStorage
 * Marks clicked artifacts with filled dots for visual feedback
 */

/**
 * Initialize artifact click tracking
 * Restores previously clicked state from localStorage and adds click handlers
 */
export function initArtifactTracking() {
 // Load clicked artifacts from localStorage on page load
 const clickedArtifacts = JSON.parse(localStorage.getItem('clickedArtifacts') || '[]')
 // ...
}
```

#### HTML/Nunjucks

- **Template comments**: `{# Explain template logic #}` for conditionals, loops, includes
- **Section descriptions**: `<!-- Section purpose -->` for major page sections
- **Inline comments**: Explain non-obvious attribute choices or data flow

Example:

```html
{# Homepage artifact list with click tracking #}
<div class="artifact-list">
 <!-- Each artifact shows a status dot that fills when clicked -->
 {% for artifact in artifacts %}
  <div class="artifact-item" data-id="{{ artifact.id }}">
   <!-- Dot indicator - filled state managed by artifacts.js -->
   <span class="artifact-status"></span>
  </div>
 {% endfor %}
</div>
```

### Semantic HTML Standards

- **Use semantic HTML5 elements**: `<header>`, `<footer>`, `<nav>`, `<main>`, `<article>`, `<section>`
- **Minimal markup**: Avoid div soup - only add containers when necessary for styling or functionality
- **ARIA attributes**: Add where appropriate for accessibility (roles, labels, states)
- **Class names describe purpose**: `.artifact-list`, `.logo-container` (not `.purple-box`, `.flex-col`)
- **No presentation classes**: Avoid utility classes like `.text-center` - use semantic CSS instead

### CSS Organization Standards

This project uses a **modern per-page loading strategy**: global foundation styles + page-specific CSS files. The guiding principle: **load only what you need, when you need it**.

#### When to use global.css

Put styles in `src/assets/css/global.css` when they are:

- **CSS custom properties** (variables for colors, transitions, animations, etc.)
- **Font-face declarations** (Karrik, FT88, etc.)
- **Semantic HTML base styles** (a, p, h1, body, img, etc.)
- **Layout systems used across multiple pages** (sticky footer, page structure, etc.)
- **Truly site-wide components** (header, footer, navbar - used on ALL pages)
- **Utility classes used across pages** (.oddhorse-inline, .emoticon, .darker, etc.)
- **Reusable animations used in multiple places** (floatUpDown, fadeOutSustain, hoverwink)

**Current global.css structure (~647 lines):**

1. CSS Custom Properties
2. Fonts
3. Semantic HTML Elements
4. Print Styles
5. Page Structure
6. Header
7. Footer
8. Navbar
9. Background Container
10. Logo Container (5rem default size)
11. Utility Classes
12. Animations

**Note:** Modal system and chaos hover have been moved to pages/index.css (homepage-only).

#### When to use pages/*.css files

Put styles in `src/assets/css/pages/[pagename].css` when they are:

- **Page-specific layouts and positioning** (only used on that page)
- **Page-specific components** (artifact list, stampede, modals used only on homepage)
- **Page-specific overrides** (logo size customization, layout changes)
- **Feature-specific styles** (chaos hover, click tracking UI)

**Current page CSS files:**

- `pages/index.css` - Homepage styles (~600 lines)
  - Flexbox vertical centering layout
  - Logo size override (7rem vs 5rem global)
  - Artifact list with badges and animations
  - Stampede overlay animations
  - Modal system (contact and links)
  - Chaos hover effects
- `pages/treats.css` - Treats page (~25 lines)
  - Centered compact layout
  - Logo size override (6rem)

#### When to use inline template styles

Put styles inline with `<style>` tags in templates when they are:

- **Self-contained component styles** (beta-menu, background canvas)
- **One-off layout tweaks** under ~20 lines
- **Tightly coupled to template structure** (styles that make no sense without the HTML)

**Examples of inline styles:**

- `src/_includes/beta-menu.njk` - Beta menu component (~82 lines, self-contained)
- `src/_includes/background.njk` - Background canvas component (~22 lines, self-contained)

#### How pages load styles

Pages specify which CSS files to load via `<link>` tags in templates:

```njk
{# In index.njk #}
<link rel="stylesheet" href="/assets/css/pages/index.css">

{# In treats.njk #}
<link rel="stylesheet" href="/assets/css/pages/treats.css">
```

**All pages load:**
- `main.css` (via head.njk) → imports reset.css + global.css

**Only homepage loads:**
- `pages/index.css` → artifact list, stampede, modals, chaos hover

**Only treats page loads:**
- `pages/treats.css` → centered layout, logo sizing

**Shop/404 pages:**
- Only global.css (minimal overhead)

#### Decision framework

**When in doubt, ask:**

1. Used on ALL pages? → `global.css`
2. Used on ONE page? → `pages/[pagename].css`
3. Self-contained component? → Inline in that component
4. Could be reused across pages later? → Start in pages/, move to global when second use appears

**Benefits of this approach:**

- Clear separation: global vs page-specific is explicit
- Performance: pages only load CSS they need (~600KB less on shop/404 pages)
- Maintainability: all homepage styles in one file, not scattered across global + inline
- Testability: test-styles.njk shows pure global defaults without page overrides

### Shared CSS Standards

- **Base styles apply to semantic elements**: `<a>`, `<p>`, `<h1>` styled site-wide in global.css
- **Page-specific styles inlined in templates**: Use `<style>` tags in individual .njk files for unique layouts
- **CSS custom properties for reusable values**: Colors, transitions, spacing defined in `:root`
- **Modern CSS features**: Use `clamp()`, `calc()`, `:is()`, CSS nesting where appropriate
- **Mobile-first**: Base styles for mobile, `@media` queries for larger screens
- **No preprocessing**: Plain CSS only - browsers handle modern features natively

### JavaScript Organization Standards

This project uses a **modern per-page loading strategy** mirroring the CSS organization: **core features loaded globally, page-specific features loaded only where needed**. No bundling or preprocessing - native ES modules with browser imports.

#### When to use core.js (always loaded)

Put features in `core.js` when they are:

- **Essential site-wide functionality** (navbar, color system, modals)
- **Used on ALL pages** (header, footer interactions)
- **Minimal overhead** (small file size, fast initialization)

**Current core.js (~20 lines):**
- Imports and initializes: `navbar.js`, `colors.js`, `modals.js`
- Loaded in head.njk on ALL pages

**Core modules (imported by core.js):**
- `navbar.js` - Logo hover color effects for all link types
- `colors.js` - Color system (derives hover colors from page color)
- `modals.js` - Modal system initialization
- `util.js` - General utilities (isMobile, randBtwn, etc.)

#### When to use page-specific JS files

Put JavaScript in `src/assets/js/[pagename].js` when it is:

- **Used on ONE page only** (homepage features, treats interactions)
- **Large features** (audio preloading, stampede, chaos hover)
- **Page-specific interactions** (artifact click tracking, header-logo rotation)

**Current page-specific JS:**

- `homepage.js` - Homepage features (~35 lines + imports)
  - Loaded only on index.njk via `<script type="module">`
  - Imports: `stampede.js`, `chaos-hover.js`, `header-logo.js`, `audio.js`
  - Preloads 9 audio files (~500KB) on page load
  - Initializes all homepage-only interactive features
- `artifacts.js` - Click tracking module (imported by homepage.js)

#### When to use feature modules

Keep features as separate importable modules when:

- **Reusable functionality** (could be imported by multiple pages)
- **Logical separation** (stampede, chaos hover are distinct features)
- **Easier maintenance** (one feature per file)

**Current feature modules:**
- `stampede.js` - Horse stampede effect
- `chaos-hover.js` - Chaotic link hover animations
- `header-logo.js` - Tagline rotation and audio
- `audio.js` - Audio context and preloading system

#### When to use inline template scripts

Put JavaScript inline with `<script type="module">` in templates when it is:

- **Component-specific interactive features** (background animation, tagline rotation)
- **Page-specific UI behaviors** (only used on one page)
- **Self-contained feature scripts** (beta-menu dev tools)
- **Code that doesn't need to be imported elsewhere**
- **Use IIFE pattern `(() => { ... })()` for scope isolation**

**Examples of inline scripts:**

- `src/index.njk` - Artifact tracking initialization (imports artifacts.js module)
- `src/_includes/background.njk` - Canvas horse animation (~250 lines, IIFE pattern)
- `src/_includes/header-logo.njk` - Tagline rotation system (~90 lines, IIFE pattern)
- `src/_includes/beta-menu.njk` - Dev tools UI (~100 lines, IIFE pattern)

#### Special cases

- **Pre-render initialization** (page color in head.njk) - inline, NOT module (runs before CSS)
- **External analytics** (gtag.njk) - async external script
- **Debug/console functions** - expose on `window` from page-specific scripts (e.g., `window.wipeClickData()` exposed in index.njk)
- **Page-specific modules** - Keep as .js files but import only in relevant templates (e.g., artifacts.js imported in index.njk, not main.js)

#### How pages load JavaScript

Pages specify which JS files to load via `<script type="module">` tags:

```njk
{# In head.njk (ALL pages) #}
<script type="module" src="/assets/js/core.js"></script>

{# In index.njk (homepage only) #}
<script type="module" src="/assets/js/homepage.js"></script>
```

**All pages load:**
- `core.js` → navbar, colors, modals (~2KB)

**Only homepage loads:**
- `homepage.js` → stampede, chaos, header-logo, audio preloading (~500KB with audio)

**Shop/404 pages:**
- Only core.js (minimal overhead)

#### Loading strategy

- **ES modules**: `type="module"` (native browser support, deferred automatically)
- **Core loaded in head**: Always available by DOMContentLoaded
- **Page-specific loaded in template**: Only where needed
- **No bundling**: Plain JavaScript, modules work natively in modern browsers

#### Decision framework

**When in doubt, ask:**

1. Used on ALL pages? → Add to `core.js`
2. Used on ONE page? → Create/use `[pagename].js`
3. Component-specific interaction? → Inline in that component with IIFE
4. Needs to run before DOM/CSS? → Inline in head (NOT module)
5. Could be imported by other code? → Feature module (stampede.js, etc.)

**Benefits of this approach:**

- Clear separation: core vs page-specific is explicit
- Performance: shop/404 don't load ~500KB of audio files
- Automatic scoping: homepage.js only runs on homepage, no conditional logic needed
- Maintainability: all homepage JS in one entry point (homepage.js)
- No lazy loading complexity: just conditional script tags

### File Organization

- **CSS**: 3 files for site-wide styles
  - `main.css` - Entry point with imports
  - `reset.css` - ⚠️ UNTOUCHABLE browser normalization
  - `global.css` - All editable site-wide styles
- **JavaScript**: Modular by feature
  - `main.js` - Entry point that initializes all modules
  - Feature modules: `navbar.js`, `colors.js`, `artifacts.js`, etc.
- **Templates**:
  - Layouts in `_layouts/` (base, landing)
  - Includes in `_includes/` (header, footer, etc.)
- **Page code**: Inline `<style>` or `<script>` tags for page-specific code

## Development Notes

### Content Management

- Music releases include lyrics, metadata, and structured data
- Projects have individual showcase pages with images
- Draft content can be excluded from production builds with `draft: true` frontmatter
- Git branch and commit info automatically injected into templates

### Performance Features

- Image optimization with multiple formats and responsive sizes
- Font loading optimization with custom font files (Karrik typeface)

## Technology Gotchas

### 11ty Bundle Plugin (`@11ty/eleventy-plugin-bundle`)

The bundle plugin concatenates `<style>` and `{% js %}` blocks from templates into consolidated output. Critical gotchas when using it:

#### 1. `{% getBundle %}` outputs content only, not wrapper tags

```njk
{# WRONG - getBundle already outputs raw content #}
{% getBundle "js" %}

{# RIGHT - you provide the wrapper tags #}
<style>{% getBundle "css" %}</style>
<script type="module">{% getBundle "js" %}</script>
```

#### 2. Use `type="module"` if any bundled code uses `import`

Bundled JS runs in a regular `<script>` by default. If ANY `{% js %}` block uses ES module syntax (`import`/`export`), you MUST use `type="module"`:

```njk
{# In head.njk #}
<script type="module">{% getBundle "js" %}</script>
```

Without this, you'll get: `SyntaxError: Cannot use import statement outside a module`

#### 3. Bundled scripts in `<head>` run before DOM exists

Unlike `<script type="module">` (which defers automatically), bundled code in regular `<script>` tags executes immediately. Any code that queries DOM elements must wait for DOMContentLoaded:

```javascript
{% js %}
// WRONG - runs before <body> exists
const btn = document.querySelector('.my-button')
btn.addEventListener('click', ...) // ERROR: btn is null

// RIGHT - wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.my-button')
    btn.addEventListener('click', ...)
})
{% endjs %}
```

#### 4. Defensive semicolons for IIFEs

When multiple `{% js %}` blocks are concatenated, missing semicolons cause syntax errors. A block ending with `})` followed by one starting with `(` parses as a function call:

```javascript
// Block 1 ends:
})
// Block 2 starts immediately:
(() => { ... })()

// JavaScript sees: })(() => { ... })()
// Tries to call undefined as a function!
```

**Fix:** Always start IIFEs with a defensive semicolon:

```javascript
{% js %}
;(() => {
    // your code
})()
{% endjs %}
```

#### 5. Buckets for organizing bundles

Use named buckets to separate code that needs different handling:

```njk
{% js "defer" %}
// Code that can load later
{% endjs %}

{# In layout, at end of body: #}
<script>{% getBundle "js", "defer" %}</script>
```

### CSS Transforms and Scrollable Overflow

When applying CSS transforms to elements, the transformed visual bounds can extend past the element's layout box and contribute to the document's scrollable area (causing scrollbars to appear).

#### The Problem

- `overflow: hidden` on an element clips **children**, not the element's own transform
- `contain: paint` clips visual rendering but also visually clips transforms (no visual overflow)
- Transforms that scale up or translate can cause the page to scroll

#### The Solution: `contain: layout`

Use `contain: layout` with `overflow: visible` to allow visual overflow while preventing scroll contribution:

```css
.element-with-wild-transforms {
    contain: layout;
    /* Prevents element from contributing to scrollable overflow
       while still allowing visual rendering outside bounds */
    overflow: visible;
    /* Allow transforms to be visible outside the box */
}
```

#### Why This Works

- `contain: layout` isolates the element's layout from the rest of the page
- The element's transformed bounds don't contribute to document scroll calculation
- But visual rendering is still allowed to extend past the element's border box

#### Alternative: Inner Wrapper

If you need `overflow: hidden` for clipping (e.g., to clip children), wrap content in an inner element and apply transforms to that:

```javascript
// Wrap content in inner span
const inner = document.createElement('span')
inner.innerHTML = el.innerHTML
el.innerHTML = ''
el.appendChild(inner)

// Apply transforms to inner - gets clipped by outer's overflow:hidden
inner.style.transform = 'rotate(45deg) scale(1.5)'
```
