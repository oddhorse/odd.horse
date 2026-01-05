# Bundling with Eleventy Bundle Plugin

## How It Works

The Bundle plugin extracts inline `<style>` and `<script>` tags from your templates and bundles them into consolidated files. This keeps your code co-located (for maintainability) but outputs clean HTML.

## Converting Your Templates

### For Inline Styles

**Before:**

```html
<style>
.my-component { color: red; }
</style>
```

**After:**

```html
{% css %}
.my-component { color: red; }
{% endcss %}
```

### For Inline Scripts

**Before:**

```html
<script type="module">
console.log('hello');
</script>
```

**After:**

```html
{% js %}
console.log('hello');
{% endjs %}
```

## Output in Layout

In your `base.njk` layout, add these where you want the bundled code:

```html
<head>
  <!-- Your existing CSS -->
  <link rel="stylesheet" href="/assets/css/main.css">
  
  <!-- Bundled inline CSS -->
  {% getBundle "css" %}
</head>

<body>
  <!-- Your content -->
  
  <!-- Your existing JS -->
  <script type="module" src="/assets/js/main.js"></script>
  
  <!-- Bundled inline JS -->
  {% getBundle "js" %}
</body>
```

## Templates to Update

1. **index.njk** - Large style block (~200 lines)
2. **beta-menu.njk** - Style block (~82 lines) + script
3. **background.njk** - Style block (~22 lines) + scripts (~250 lines)
4. **header-logo.njk** - Script (~90 lines)
5. **head.njk** - Page color initialization script

## Buckets (Optional)

You can create separate bundles for critical vs deferred code:

```html
{% css "critical" %}
/* Above-the-fold styles */
{% endcss %}

{% css "defer" %}
/* Below-the-fold styles */
{% endcss %}
```

Then output them separately:

```html
<head>
  {% getBundle "css", "critical" %}
</head>
<body>
  <!-- content -->
  {% getBundle "css", "defer" %}
</body>
```

## Benefits

✅ Clean HTML output (no scattered `<style>`/`<script>` tags)  
✅ Code stays co-located with components  
✅ Automatic deduplication  
✅ Optional per-page bundles  
✅ Optional minification
