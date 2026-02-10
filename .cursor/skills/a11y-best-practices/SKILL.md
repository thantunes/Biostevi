---
name: a11y-best-practices
description: Reviews markup and React/VTEX components against accessibility best practices: roles, ARIA, contrast, focus, keyboard, screen readers. Use when the user asks for an accessibility review, a11y check, WCAG compliance, or to make something accessible.
---
# Accessibility Best Practices

## Quick start

1. Identify scope: file(s) or component(s) the user wants reviewed (from conversation or open files).
2. Run through the checklist below for each relevant UI (HTML/JSX, CSS that affects visibility or focus).
3. Report findings by severity: **Critical** (blocks use), **Suggestion** (should fix), **Nice to have** (improvement).
4. Propose concrete changes (code or config) for each finding when possible.

## Checklist (summary)

- **Semantics**: Use correct HTML elements (`button`, `nav`, `main`, `heading` levels). Avoid div/span for interactive or landmark content when a native element exists.
- **ARIA**: Use ARIA only when HTML is not enough. Prefer `aria-label` or `aria-labelledby` for unnamed controls; `aria-expanded`, `aria-controls` for disclosure/tabs; `role` only when no native equivalent.
- **Images**: All meaningful images have `alt`; decorative images have `alt=""` or `role="presentation"`.
- **Forms**: Inputs have visible `<label>` or `aria-label`; errors are associated (`aria-describedby`, `aria-invalid`).
- **Focus**: Interactive elements are focusable (no `tabindex="-1"` unless for modal trapping); focus order is logical; focus is visible (no `outline: none` without a replacement).
- **Keyboard**: All actions available with mouse are available with keyboard (Enter/Space for buttons, arrows for menus/carousels). No keyboard traps except in modals (with escape to close).
- **Contrast**: Text meets WCAG AA (4.5:1 normal, 3:1 large); sufficient contrast for UI controls and focus indicators.
- **Motion**: Respect `prefers-reduced-motion` where animations are non-essential (disable or reduce).

## Project context

- React components (JSX); VTEX blocks. Use project class naming (e.g. `vtex-*-*`) when suggesting class-based styles.
- Sliders/carousels: ensure arrows and dots are focusable and have labels; consider `aria-live` for slide changes if they auto-rotate.

## Output format

For each finding:

- **Severity**: Critical | Suggestion | Nice to have  
- **Location**: file and element/component  
- **Issue**: what is wrong  
- **Recommendation**: how to fix (code or steps)

## Additional resources

- Detailed WCAG 2.1 criteria and ARIA patterns: see [reference.md](reference.md) when needed.
