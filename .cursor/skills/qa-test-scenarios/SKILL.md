---
name: qa-test-scenarios
description: Creates test scenarios from current code or feature: steps, test data, and expected results in a reusable format (markdown or structure for manual/automated tests). Use when the user asks for test scenarios, QA cases, how to test this feature, or test cases.
---
# QA Test Scenarios

## When to use

- User asks for test scenarios, QA cases, "how to test this feature", or test cases.
- Scope: the feature, component, or flow the user is working on (from conversation or open files).

## Output format

Produce scenarios in Markdown. Each scenario has:

1. **Title**: Short, unique name (e.g. "FAQ – open first item", "Slider – navigation arrows").
2. **Preconditions**: State or data needed before the test (e.g. "User on homepage", "Product X in cart").
3. **Steps**: Numbered list of actions (user or system).
4. **Expected result**: What should happen after the steps (per step or at the end).
5. **Test data** (if relevant): Concrete values (IDs, slugs, text) so tests are reproducible.

Optional: **Priority** (Critical / High / Medium / Low), **Type** (functional, regression, a11y, etc.).

## Scenario types for this project

- **VTEX blocks**: Add block → configure in Site Editor → check render and props (e.g. slider items per page, visibility of arrows).
- **React components**: Render with given props → check UI and behavior (clicks, keyboard, responsive).
- **Flows**: Navigation, search, PDP, cart, checkout — one scenario per happy path and main edge cases (empty state, error).
- **A11y**: Keyboard navigation, focus order, screen reader (can reference a11y skill); one scenario per critical path.
- **Responsive**: Same scenario with viewport variants (desktop, tablet, phone) when layout/behavior changes.

## Process

1. Identify the feature/component/flow from context.
2. List main behaviors and edge cases (happy path, empty, error, limits).
3. Write one or more scenarios in the format above.
4. Save to a file if the user asks for a file: e.g. `docs/qa/<feature-or-component>.md` or next to the component `ComponentName.qa.md`.

## Example (snippet)

```markdown
## Scenario: FAQ – open and close first item

- **Preconditions**: User on page with FAQ block; at least one item.
- **Steps**:
  1. Locate the first FAQ question.
  2. Click (or activate with keyboard) the question.
  3. Verify the answer is visible.
  4. Activate the question again.
- **Expected**: Answer toggles open/closed; focus and aria-expanded stay correct.
- **Data**: Use content from store (e.g. Duvidas-Frequentes) or fixture.
```

## Rules

- Steps must be executable by a human (or mapped to automation later); avoid vague steps.
- One scenario per behavior variant; avoid long combined scenarios.
- Prefer Portuguese (BR) if the project and user use it; otherwise English.
