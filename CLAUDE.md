# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website for music artist [oddhorse](https://odd.horse), built as a static site using 11ty (Eleventy) with Nunjucks templates. The site features music releases, projects, blog posts, and various tools/utilities.

## Development Commands

### Building and Serving

- `npm run build` - Build the static site to `dist/` folder
- `npm run serve` - Build and serve the site locally with live reload
- `npm run start` - Alias for serve
- `npm run watch` - Build and watch for changes without serving
- `npm run clean` - Clean the dist folder
- `npm run build-ghpages` - Build with GitHub Pages path prefix
- `npm run bench` - Run with benchmark debugging enabled

No test suite or linting is currently configured.

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

- **CSS**: Hybrid organization with 3 global files + inline template styles
  - `main.css` - Entry point that imports reset and global
  - `reset.css` - ⚠️ UNTOUCHABLE browser normalization (modern-normalize)
  - `global.css` - Site-wide reusable styles (~900 lines)
    - CSS custom properties, fonts, semantic HTML base styles
    - Site-wide components (header, footer, navbar, modal system)
    - Utility classes and reusable animations
  - **Inline template styles** - Page-specific and component-specific styles
    - `index.njk` - Homepage layout and artifact list styles (~200 lines)
    - `beta-menu.njk` - Beta menu component styles (~82 lines)
    - `background.njk` - Background canvas styles (~22 lines)
- **JavaScript**: Hybrid organization with global modules + page-specific imports
  - **Global modules** (loaded site-wide):
    - `main.js` - Entry point, initializes navbar, colors, modals
    - `navbar.js` - Logo hover color effect
    - `colors.js` - Derives hover colors from page color
    - `modals.js` - Modal system (contact and links popups)
  - **Page-specific modules** (imported only where needed):
    - `artifacts.js` - Click tracking with localStorage (imported in index.njk only)
  - **Inline template scripts**:
    - `index.njk` - Artifact tracking initialization
    - `background.njk` - Canvas animation (~250 lines)
    - `header-logo.njk` - Tagline rotation (~90 lines)
    - `beta-menu.njk` - Dev tools (~100 lines)
- **Modern CSS Features**: Custom properties (variables), clamp(), calc(), modern selectors, :has()

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

This project uses a hybrid approach balancing modularity with legibility for a codebase of this complexity (~900 lines global CSS, ~13 templates). The guiding principle: **co-locate page-specific code, centralize truly reusable code**.

#### When to use global.css

Put styles in `src/assets/css/global.css` when they are:

- **CSS custom properties** (variables for colors, transitions, animations, etc.)
- **Font-face declarations** (Karrik, FT88, etc.)
- **Semantic HTML base styles** (a, p, h1, body, img, etc.)
- **Layout systems used across multiple pages** (sticky footer, page structure, etc.)
- **Site-wide components used on 2+ pages** (header, footer, navbar, modal system)
- **Utility classes used across pages** (.oddhorse-inline, .emoticon, .darker, etc.)
- **Reusable animations used in multiple places** (floatUpDown, fadeOutSustain, hoverwink)

**Current global.css structure:**

1. CSS Custom Properties
2. Fonts
3. Semantic HTML Elements
4. Print Styles
5. Page Structure
6. Header
7. Footer
8. Navbar
9. Background Container
10. Logo Container
11. Utility Classes
12. Animations
13. Modal System

#### When to use inline template styles

Put styles inline with `<style>` tags in templates when they are:

- **Page-specific layouts and positioning** (only used on one page)
- **Page-specific components** (artifact list on homepage, hero sections, etc.)
- **Self-contained feature components** (beta-menu, background canvas)
- **Page-specific overrides of global styles** (customizing logo size on homepage)
- **Styles unique to a single template** (specific to that page's layout or content)

**Examples of inline styles:**

- `src/index.njk` - Homepage layout (body padding, flexbox centering, artifact list styles)
- `src/_includes/beta-menu.njk` - Beta menu component (~82 lines, self-contained)
- `src/_includes/background.njk` - Background canvas component (~22 lines, self-contained)

#### Keep together for maintenance

- **Site-wide reusable components** (modals, headers, footers) → `global.css`
  - Rationale: Used across multiple pages, changing them affects entire site
  - Example: Modal system could be extended with more modals (shop, image lightbox, etc.)

- **Page-specific features** (artifact list, page heroes) → Inline in that page's template
  - Rationale: Only used once, co-locating HTML and CSS improves maintainability
  - Example: Artifact list (~187 lines) only appears on homepage

- **Self-contained utility components** (beta-menu) → Inline in their include file
  - Rationale: Component-specific styles travel with the component
  - Example: Beta menu is a feature flag component, styles are part of its implementation

#### Decision framework

**When in doubt, ask:**

1. Is it used on 2+ pages? → `global.css`
2. Is it page-specific? → Inline in that page
3. Is it a self-contained component? → Inline in that component
4. Could it be reused later? → Consider `global.css` if it's infrastructure

**For this codebase size:**

- ~900 lines global CSS is manageable and aids discoverability
- Aggressive modularization (separate CSS files per component) hurts legibility
- Co-locate page-specific code for easier reasoning about behavior
- Keep truly global/reusable code centralized for consistency

### Shared CSS Standards

- **Base styles apply to semantic elements**: `<a>`, `<p>`, `<h1>` styled site-wide in global.css
- **Page-specific styles inlined in templates**: Use `<style>` tags in individual .njk files for unique layouts
- **CSS custom properties for reusable values**: Colors, transitions, spacing defined in `:root`
- **Modern CSS features**: Use `clamp()`, `calc()`, `:is()`, CSS nesting where appropriate
- **Mobile-first**: Base styles for mobile, `@media` queries for larger screens
- **No preprocessing**: Plain CSS only - browsers handle modern features natively

### JavaScript Organization Standards

This project uses a hybrid approach mirroring the CSS organization philosophy: **co-locate component-specific code, centralize truly reusable functionality**. No bundling or preprocessing - native ES modules with browser imports.

#### When to use global modules

Put JavaScript in `src/assets/js/` modules when it is:

- **Entry point** (`main.js`) that orchestrates initialization
- **Feature modules used across multiple pages** (navbar, colors, artifacts, modals)
- **Shared utilities** (device detection, number helpers, DOM helpers)
- **Core functionality that other code depends on** (must be importable)
- **Any code that needs to be imported and reused**

**Current global module structure:**

- `main.js` - Entry point, initializes site-wide features (navbar, colors, modals)
- `navbar.js` - Logo hover color effects for all link types
- `colors.js` - Color system (derives hover colors from page color)
- `modals.js` - Modal system (contact and links popups)
- `util.js` - General utilities (isMobile, randBtwn, etc.)

**Page-specific modules** (kept as modules but only imported where needed):

- `artifacts.js` - Click tracking with localStorage (imported only in index.njk)

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

#### Loading strategy

- **Main app**: ES modules with `type="module"` (native browser support, deferred automatically)
- **Entry point**: Loaded in `<head>` with `type="module"`
- **Inline scripts**: Run independently in module scope
- **No bundling**: Plain JavaScript, modules work natively in modern browsers

#### Decision framework

**When in doubt, ask:**

1. Used across multiple pages or components? → Global module
2. Component-specific interaction? → Inline in that component
3. Needs to run before DOM/CSS? → Inline in head (NOT module)
4. Needs to be imported by other code? → Global module
5. Self-contained feature? → Inline with IIFE pattern

**For this codebase size:**

- ~6 modules, ~440 lines inline is appropriate and aids discoverability
- Aggressive modularization (separate files per component) hurts legibility
- Co-locate component-specific code for easier reasoning about behavior
- Keep truly reusable code centralized for consistency
- Not building a framework - don't over-engineer

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
