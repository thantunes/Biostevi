---
name: seo-psi
description: Analyzes pages and components for SEO (meta tags, headings, alt text) and suggests improvements aligned with PageSpeed Insights and Core Web Vitals (LCP, CLS, FID/INP). Use when the user asks to analyze SEO, check PSI, optimize performance, or improve Core Web Vitals.
---
# SEO and PageSpeed Insights

## Quick start

1. Identify scope: page(s), route(s), or component(s) the user wants analyzed (from URL, store blocks, or open files).
2. Run the SEO checklist and the PSI/CWV checklist on that scope.
3. Report findings with severity and concrete recommendations (code or config).
4. If the user provides a live URL, suggest running PageSpeed Insights (or Lighthouse) and correlate with code-level suggestions.

## SEO checklist

- **Meta**: Unique, descriptive `title` and `meta description` per page (or template); length guidelines (title ~50–60 chars, description ~150–160).
- **Headings**: Single H1 per page; logical hierarchy (H1 → H2 → H3, no skips); headings describe content.
- **Images**: Meaningful images have descriptive `alt`; decorative images have `alt=""` or equivalent.
- **Links**: Link text is descriptive (avoid "clique aqui"); internal links use stable, readable URLs where possible.
- **Structured data**: If the project uses JSON-LD or similar, ensure it is valid and matches the visible content.
- **Canonical / hreflang**: If multi-region or duplicate content, recommend canonical or hreflang as appropriate.

## PageSpeed / Core Web Vitals checklist

- **LCP (Largest Contentful Paint)**: Main content loads quickly. Suggest: optimize or lazy-load images, reduce render-blocking resources, critical CSS; ensure hero/large images have appropriate size and format.
- **CLS (Cumulative Layout Shift)**: No unexpected layout jumps. Suggest: dimensions on images and embeds, reserve space for ads/dynamic content, avoid inserting content above existing content.
- **FID / INP (Interaction to Next Paint)**: Interface responds quickly to input. Suggest: reduce long tasks, break up work, avoid heavy JS on main thread during interaction.
- **General**: Minimize unused CSS/JS; defer non-critical scripts; use efficient caching and compression (often server/config).

## Project context

- VTEX Store Framework: templates in `store/blocks/`, React components in `react/` and app folders. Meta and global structure may be set at template or layout level.
- Styles in `styles/css/`; consider impact of CSS on render and layout stability.

## Output format

- **SEO**: List finding, location, and recommendation.
- **PSI/CWV**: List metric, cause (if identifiable in code), and recommendation.
- If the user wants, suggest a short action list (top 3–5 items) to do first.

## Optional

- For live URLs, recommend running [PageSpeed Insights](https://pagespeed.web.dev/) and using the report to prioritize; then map issues back to code (e.g. specific image, script, or block).
