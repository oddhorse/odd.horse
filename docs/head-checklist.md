# Head Checklist — Recommended `<head>` items

This document collects easy, high-impact `<head>` items to add to `src/_includes/head.njk` for SEO, social sharing, performance, PWA, privacy/security, and accessibility. Include per-page variables via Eleventy (examples use `title`, `description`, `canonical`, `ogImage`, `site.url`, `eleventy.env.runMode`).

## Quick summary (low-effort, high-impact)

- `meta description` — search snippet content (50–160 chars).
- `rel=canonical` — canonicalize the page URL (absolute URL).
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`.
- Twitter: `twitter:card` (use `summary_large_image`) and `twitter:site` (optional).
- `referrer-policy` — tighten referrer exposure (e.g. `strict-origin-when-cross-origin`).
- Preconnect to critical third-party origins (fonts/CDN).
- Preload critical fonts (keep existing) and LCP image(s) when known.
- JSON-LD structured data (Organization / WebSite / BreadcrumbList / Article).
- `meta name="robots"` — use `noindex` for staging or private pages.

## Example Eleventy snippets (copy/paste)

Place these in `src/_includes/head.njk`, using your site data and page variables.

Basic SEO + Social

```njk
<meta name="description" content="{{ description | default(site.meta.description) }}">
<link rel="canonical" href="{{ site.url | default('https://example.com') }}{{ page.url }}">
<meta name="robots" content="{{ noindex ? 'noindex, nofollow' : 'index, follow' }}">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="{{ title }}">
<meta property="og:description" content="{{ description | default(site.meta.description) }}">
<meta property="og:url" content="{{ site.url | default('https://example.com') }}{{ page.url }}">
<meta property="og:site_name" content="{{ site.title | default('Site Name') }}">
<meta property="og:image" content="{{ ogImage | default(site.meta.ogImage) }}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="{{ site.twitter || '@yourhandle' }}">
<meta name="twitter:title" content="{{ title }}">
<meta name="twitter:description" content="{{ description | default(site.meta.description) }}">
<meta name="twitter:image" content="{{ ogImage | default(site.meta.ogImage) }}">
```

Referrer & privacy

```njk
<meta name="referrer" content="strict-origin-when-cross-origin">
<!-- or: no-referrer, origin, origin-when-cross-origin depending on needs -->
```

Preconnect / dns-prefetch / preload

```njk
{# Example: fonts.gstatic.com when using Google-hosted fonts #}
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="//fonts.gstatic.com">

{# Preload an LCP image (page-specific) #}
{% if page.lcpImage %}
<link rel="preload" as="image" href="{{ page.lcpImage }}" imagesrcset="{{ page.lcpImageSrcset | default('') }}" imagesizes="{{ page.lcpImageSizes | default('') }}" fetchpriority="high">
{% endif %}
```

Fonts

- Keep your `rel=preload` for critical `.woff2` fonts (you already have this). Ensure your `@font-face` uses `font-display: swap` in CSS to avoid FOIT.

JSON-LD examples

```njk
<script type="application/ld+json">
{{ {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": site.url,
  "name": site.title,
  "potentialAction": {
    "@type": "SearchAction",
    "target": "{{ site.url }}/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
} | dump }}
</script>
```

(For articles/posts use `Article` with author, datePublished, image; validate at Google Rich Results Test.)

PWA and mobile

- Keep `link rel="manifest"` (already present). Ensure `site.webmanifest` has `icons`, `start_url`, `short_name`.
- Add optional iOS meta: `<meta name="apple-mobile-web-app-capable" content="yes">` and `apple-touch-icon` (already present).
- Provide `mask-icon` for Safari pinned tab:

```njk
<link rel="mask-icon" href="/assets/favicon/safari-pinned.svg" color="{{ color | default('#000') }}">
```

Security headers (server-side recommended)

- Prefer to set `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, and `Permissions-Policy` via HTTP response headers.
- If you add CSP and keep inline scripts (like the `document.documentElement.style.setProperty`), you will need to include CSP hashes or migrate inline code to external scripts.

Verification / indexing

```njk
{# Add only in production; use env detection like your gtag include #}
{% if eleventy.env.runMode != 'serve' %}
<meta name="google-site-verification" content="YOUR_TOKEN_HERE">
{% endif %}
```

Accessibility & misc

- `meta name="color-scheme" content="light dark"` to indicate support for both schemes.
- `meta name="format-detection" content="telephone=no"` to prevent unwanted phone-linking on iOS.
- Add `link rel="alternate" type="application/rss+xml" href="/feed.xml"` if you publish a feed.

Notes & best practices

- Use absolute URLs for `og:image` and `rel=canonical` (e.g., `{{ site.url }}{{ page.url }}`).
- Avoid duplicate/conflicting tags: single `viewport`, single `canonical`, single `description` per page.
- Only preload fonts/images that are truly critical (LCP or first viewport).
- Wrap analytics and verification in an environment check to avoid staging exposure (you already wrap `gtag`).
- If enforcing strict CSP, replace inline scripts or compute CSP hashes during build.

## Implementation checklist (copy into your workflow)

- [ ] Add `meta description` to `head.njk` and populate per-page.
- [ ] Add `rel=canonical` generation using `site.url` + `page.url`.
- [ ] Add Open Graph + Twitter tags (use `ogImage` fallback rules).
- [ ] Add `referrer-policy` and `color-scheme` meta.
- [ ] Add `preconnect` for external origins you use and `preload` for LCP images.
- [ ] Add JSON-LD for site-level schema and page types where applicable.
- [ ] Verify `site.webmanifest` contains required fields.
- [ ] Test with Lighthouse, Rich Results Test, and social card validators (Twitter Card Validator / Facebook Sharing Debugger).

---

If you want, I can now:

- Insert the minimal snippets directly into `src/_includes/head.njk` (with your Eleventy variables), or
- Add an entry to `README.md` linking to this doc.

Which would you like next?
