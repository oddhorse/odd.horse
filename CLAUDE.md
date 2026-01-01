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

### Code Quality

- `npx biome check` - Run linting and formatting checks
- `npx biome format` - Format code according to biome.json config
- `npx biome lint` - Run linting only

No test suite is currently configured.

## Architecture

### Site Generation (Eleventy)

- **11ty** handles static site generation with Nunjucks templating
- **Plain CSS** - no preprocessing, uses modern browser features natively
- **ES Modules** - JavaScript loaded natively by browser, no bundling
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

- **CSS**: Three files in `src/assets/css/`
  - `main.css` - Entry point that imports reset and global
  - `reset.css` - ⚠️ UNTOUCHABLE browser normalization (modern-normalize)
  - `global.css` - All editable site-wide styles (fonts, variables, semantic elements, layout, components, animations, print)
  - Page-specific styles are inlined in templates with `<style>` tags
- **JavaScript**: Modular ES modules in `src/assets/js/`
  - `main.js` - Entry point, initializes navbar, colors, artifact tracking
  - `navbar.js` - Logo hover color effect
  - `colors.js` - Derives hover colors from page color
  - `artifacts.js` - Click tracking with localStorage
- **Modern CSS Features**: Custom properties (variables), clamp(), calc(), modern selectors

### Deployment

- **GitHub Actions** handle automated deployment
- **Main branch** → Production server via SSH/rsync
- **Beta branch** → Beta server for testing
- No build-time asset processing - browser handles modern CSS/JS natively

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

### Shared CSS Standards

- **Base styles apply to semantic elements**: `<a>`, `<p>`, `<h1>` styled site-wide in base.css
- **Page-specific styles inlined in templates**: Use `<style>` tags in individual .njk files for unique layouts
- **CSS custom properties for reusable values**: Colors, transitions, spacing defined in `:root`
- **Modern CSS features**: Use `clamp()`, `calc()`, `:is()`, CSS nesting where appropriate
- **Mobile-first**: Base styles for mobile, `@media` queries for larger screens
- **No preprocessing**: Plain CSS only - browsers handle modern features natively

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

### Code Style (Biome Configuration)

- **Indentation**: Tabs (width 2 for JS, width 3 for CSS)
- **JavaScript**: Semicolons as needed, single quotes
- **Formatting**: Auto-formatting enabled for consistency

### Content Management

- Music releases include lyrics, metadata, and structured data
- Projects have individual showcase pages with images
- Draft content can be excluded from production builds with `draft: true` frontmatter
- Git branch and commit info automatically injected into templates

### Performance Features

- Image optimization with multiple formats and responsive sizes
- Font loading optimization with custom font files (Karrik typeface)
