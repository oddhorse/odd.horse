# CSS Review Skill

You are reviewing CSS code for the ODDHORSE website. Apply these strict standards:

## What to Check

### 1. Comment Verbosity
**REQUIRED:** Every CSS file must have extensive comments explaining INTENT, not implementation.

- **File-level comment**: `/** FILENAME description */` at top
- **Section headers**: `/* ===== SECTION ===== */` with explanation
- **Rule comments**: Explain WHY rules exist, not WHAT they do
- **Property comments**: Explain non-obvious values

**Example of GOOD commenting:**
```css
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

**Example of BAD commenting:**
```css
/* Logo container */
.logo-container {
  display: flex;  /* Use flexbox */
}
```

### 2. Organization - Global vs Inline

**Check if code is in the right place:**

**Should be in global.css:**
- CSS custom properties (variables)
- Font-face declarations
- Semantic HTML base styles (a, p, h1, body, etc.)
- Site-wide components (used on 2+ pages)
- Utility classes used across pages
- Reusable animations

**Should be inline in templates:**
- Page-specific layouts and positioning
- Page-specific components (only used once)
- Self-contained feature components
- Page-specific overrides

**Flag if:**
- Page-specific styles in global.css → "Consider moving to inline styles in [page].njk"
- Reusable components inline → "Consider moving to global.css for reusability"

### 3. Modern CSS Features

**ENCOURAGE:**
- CSS custom properties: `var(--color-primary)`
- Modern functions: `clamp()`, `calc()`, `min()`, `max()`
- Modern selectors: `:is()`, `:where()`, `:has()`
- Container queries (when appropriate)
- CSS nesting (when it improves readability)

**DISCOURAGE:**
- Magic numbers without comments
- Hardcoded colors (should be CSS variables)
- Overly specific selectors (`.page .section .item` → `.item`)
- !important (except for utilities)

### 4. Semantic Standards

- Class names describe purpose, not presentation
- Minimal markup - no div soup
- No presentation classes (`.text-center`, `.margin-20`)

## Review Process

1. **Read the entire file** to understand context
2. **Check each section** against the criteria above
3. **Provide specific feedback** with line numbers
4. **Suggest improvements** with code examples
5. **Praise good patterns** when you see them

## Output Format

```markdown
## CSS Review: [filename]

### ✅ Strengths
- [What's done well]

### ⚠️ Issues Found

#### Missing Comments
- Line X: [Specific issue and suggestion]

#### Organization
- [If code should be moved elsewhere]

#### Modern CSS
- [Opportunities to use modern features]

### 📝 Suggested Improvements

[Code examples showing recommended changes]

### Summary
[Overall assessment and priority of fixes]
```

## Important

- Be thorough but constructive
- Explain WHY each suggestion matters
- Provide concrete examples
- Consider the hybrid organization philosophy (not everything needs to be in global.css)
