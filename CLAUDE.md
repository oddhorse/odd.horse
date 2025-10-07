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

### Site Generation (Eleventy + Vite)
- **11ty** handles static site generation with Nunjucks templating
- **Vite** processes SCSS and JavaScript, provides dev server integration
- **eleventy.config.js** contains the main configuration including:
  - Vite integration with custom build pipeline
  - Image optimization with multiple formats (AVIF, WebP, SVG, JPEG)
  - Critical CSS inlining for performance
  - Git info injection for templates
  - Custom date parsing and filters

### Content Structure
- **Pages**: Top-level `.njk` files in `src/` (index, about, contact, etc.)
- **Collections**: Organized in subdirectories with `.json` data files
  - `music/` - Music releases with individual pages and shared data
  - `projects/` - Project showcase pages
  - `posts/` - Blog posts (Markdown)
  - `tools/` - Utility pages

### Template System
- **Layouts**: `src/_layouts/` contains base templates
  - `base.njk` - Main layout with header/footer
  - `landing.njk` - Homepage-specific layout
- **Includes**: `src/_includes/` for reusable components
- **Data**: `src/_data/` for global data (build info, links, meta, videos)
- **Filters**: `src/_config/filters.js` provides date formatting and utility functions

### Asset Pipeline
- **SCSS**: Organized in numbered directories for cascade control
  - `1-normals/` - Reset and print styles  
  - `2-globals/` - Fonts and variables
  - `3-elements/` - Element and custom component styles
  - `4-layout/` - Layout-specific styles with media queries
  - `5-animations/` - Animation definitions
- **JavaScript**: Modular approach with `main.js` as entry point
  - `navbar.js`, `colors.js` for specific functionality
  - Page-specific scripts in `pages/` subdirectory

### Deployment
- **GitHub Actions** handle automated deployment
- **Main branch** → Production server via SSH/rsync
- **Beta branch** → Beta server for testing
- Critical CSS generation and asset optimization in build pipeline

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
- Critical CSS extraction and inlining
- Asset bundling and cache-busting via Vite
- Font loading optimization with custom font files (Karrik typeface)