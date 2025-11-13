# Claude Styling Instructions for odd.horse

## CRITICAL: Use Minimal Additive CSS

When generating new HTML for this project, **USE AS LITTLE ADDITIVE CSS AS POSSIBLE**. The existing SCSS system provides comprehensive styling - rely on it instead of adding custom styles.

## Typography - DO NOT CHANGE FONTS
- **Primary font**: `Karrik` (already loaded via `@font-face`)
- **DO NOT** add `font-family` declarations - body already uses `font-family: Karrik, sans-serif`
- **DO NOT** change font weights, sizes, or typography - use existing element styles

## Color System - Use CSS Custom Properties
```scss
// Available colors (from 2-globals/_variables.scss)
--text-color: #000000
--oddhorse-color: #ff00bb  // Primary brand color
--background-color: #ffffff
--lighter-text-color: #7e7e7e
--page-color: #000000  // Dynamic per-page color
--link-color: #000000
--link-hover-color: #ff00bb
--button-background-color: #ff00bb
--accent-background-color: #ff00bb
--hover-background-color: #ff00bb
```

## Existing Element Styles (DO NOT OVERRIDE)
- `p` elements: `font-size: 1.4rem; letter-spacing: 0.01rem; color: var(--text-color)`
- `h1` elements: `font-size: 3rem; text-align: center; margin-bottom: 1rem; letter-spacing: -0.1rem`
- `a` elements: Use `color: var(--link-color)` with wavy underlines and `--link-hover-color` on hover
- `img` elements: `max-width: 100%; height: auto` (responsive by default)

## Layout Classes - Use These Instead of Custom CSS
- `.project-card` with `.info-box` - for project layouts
- `.release-card` with `.info-box` - for music release layouts  
- `.img-fluid` - standardized image sizing (`width: 35rem`)
- `.oddhorse-inline` - for inline brand name styling

## Media Queries - Use Existing Breakpoints
```scss
$mq-small: "screen and (max-width: 47.9375em)"    // ~768px
$mq-medium: "screen and (min-width: 48em)"        // 768px+  
$mq-large: "only screen and (min-width: 64.0625em)" // ~1030px+
$mq-x-large: "screen and (min-width: 90em)"       // 1440px+
```

## Animation Classes - Use Built-in Animations
- `.hoverwink` - hover scale/translate effect
- `.hoverwink-animate` - programmatic bounce animation
- `.floating` - for floating navigation elements

## Transitions - Use Existing Timing Variables
```scss
--link-hover-transition-speed: 0.2s
--link-hover-transition-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.5)
--hoverwink-transition-speed: 0.2s
--hoverwink-transition-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.5)
```

## Spacing System - Infer from Existing Patterns
- Main content padding: `3.5rem` desktop, `1rem` mobile
- Header padding: `2rem 3rem` desktop, `1rem` mobile  
- Common margins: `0.5rem`, `1rem`, `1.5rem`, `2rem`
- Use `gap` property for flex/grid spacing

## Page-Specific Styling Approach
- Each page can set `--page-color` via inline `<script>` in template
- Color variations handled through CSS custom properties, not new styles
- Layout variations through existing classes, not custom CSS

## What to AVOID
- ❌ Adding `font-family` declarations
- ❌ Custom color values (use CSS custom properties)
- ❌ Custom breakpoints (use existing `$mq-*` variables)
- ❌ Inline styles (except for dynamic `--page-color` setting)
- ❌ Large blocks of embedded CSS
- ❌ Overriding existing element styles

## What to DO
- ✅ Use existing CSS custom properties for colors
- ✅ Use existing layout classes (`.project-card`, `.release-card`, etc.)
- ✅ Use existing utility classes (`.img-fluid`, `.hoverwink`, etc.)
- ✅ Follow existing spacing patterns
- ✅ Use existing media query variables
- ✅ Let the cascade handle styling through existing rules
- ✅ Add minimal, semantic HTML structure that leverages existing styles

## Example: Good vs Bad Approach

### ❌ BAD - Too much custom CSS
```html
<style>
.custom-layout {
  font-family: serif;
  color: #333333;
  font-size: 16px;
  padding: 20px;
  background: #f0f0f0;
}
</style>
<div class="custom-layout">Content</div>
```

### ✅ GOOD - Leverage existing system
```html
<div class="project-card">
  <div class="info-box">
    <h2>Title</h2>
    <p>Content automatically gets correct Karrik font, spacing, and colors</p>
  </div>
</div>
```

The existing SCSS architecture is comprehensive - trust it to handle styling with minimal additions.