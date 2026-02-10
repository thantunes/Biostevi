# A11y Reference

## WCAG 2.1 (Level A/AA) – quick reference

- **1.1.1 Non-text content**: Alt text for images; decorative = empty alt or presentational.
- **1.3.1 Info and relationships**: Structure (headings, lists, labels) programmatically determinable.
- **1.4.3 Contrast (minimum)**: 4.5:1 text (normal), 3:1 large text; 3:1 for UI components.
- **2.1.1 Keyboard**: All functionality via keyboard.
- **2.1.2 No keyboard trap**: Can leave any component with keyboard (except modals with explicit escape).
- **2.4.3 Focus order**: Order preserves meaning and operability.
- **2.4.7 Focus visible**: Keyboard focus indicator visible.
- **4.1.2 Name, role, value**: UI components have accessible name and role; state/value exposed.

## ARIA usage (when HTML is not enough)

- **aria-label** / **aria-labelledby**: Name for icons, icon buttons, regions.
- **aria-expanded** / **aria-controls**: Disclosure, accordion, tabs.
- **aria-live**: Announce dynamic content (e.g. slide change) to screen readers.
- **role="button"** etc.: Only if you cannot use `<button>` (then add keyboard and focus).

## VTEX / React

- Use semantic HTML first; add ARIA only when necessary.
- Ensure VTEX blocks that render custom UI (sliders, modals, menus) expose focus and labels.
