# New Page Creation Skill

You are creating a new page for the ODDHORSE website following Eleventy conventions.

## What to Create

When user runs `/new-page [pagename]`, create a complete page template.

## Template Structure

Create `/Users/bear/Desktop/ODDHORSE SITE/src/[pagename].njk` with this structure:

```njk
---
layout: base
title: [Page Title]
description: [SEO description]
permalink: /[pagename]/
pageColor: rgb(XXX, XXX, XXX)
eleventyNavigation:
  key: [pagename]
  order: [number]
---

{# [Page description comment] #}

<style>
/* ===== [PAGENAME] PAGE STYLES =====
 * [Describe page layout and purpose]
 */

/* Page-specific layout */
body {
  /* [Layout description] */
}

/* Page-specific components */

</style>

<main>
  <!-- Main content here -->
  <h1>{{ title }}</h1>

  <!-- Add page content sections -->

</main>

<script type="module">
/**
 * [pagename].js
 * [Describe any page-specific JavaScript]
 */

// Page-specific interactive features
(() => {
  // Implementation
})();
</script>
```

## Steps to Complete

1. **Ask user for details:**
   - Page title
   - Purpose/description
   - Primary color (RGB values)
   - Navigation order
   - Any special features

2. **Generate page file** with complete structure

3. **Update navigation** if needed:
   - Check if page should be in main nav
   - Update `src/_data/navigation.json` if it exists

4. **Create any supporting files:**
   - If page needs images, note the expected path: `src/assets/images/[pagename]/`
   - If page needs data, suggest creating `src/_data/[pagename].json`

5. **Provide next steps:**
   - Where to add content
   - How to test the page
   - Reminder to run `npm run serve`

## Standards to Follow

### Frontmatter
- Always include: `layout`, `title`, `description`, `permalink`
- Include `pageColor` (drives navbar hover color)
- Include `eleventyNavigation` if page should be in nav

### Comments
- File-level comment describing page purpose
- Section comments in CSS
- JSDoc for JavaScript functions

### CSS
- Inline styles for page-specific layout
- Use CSS custom properties from global.css
- Follow mobile-first approach
- Comment all non-obvious values

### HTML
- Semantic elements (`<main>`, `<article>`, `<section>`)
- Meaningful class names
- ARIA attributes where appropriate

### JavaScript
- Use IIFE pattern for scope isolation
- Modern ES6+ syntax
- Comment intent, not implementation

## Example Interaction

**User:** `/new-page gallery`

**You should:**
1. Ask: "What kind of gallery? (music, photos, projects?)"
2. Ask: "What color scheme? (provide RGB values)"
3. Create complete template file
4. Explain: "I've created src/gallery.njk. Add your gallery items to src/_data/gallery.json"

## Important

- Follow the project's hybrid organization (inline page-specific styles)
- Match the verbosity of existing pages
- Don't create unnecessary files - keep it minimal
- Provide clear next steps for the user
