---
name: component-docs
description: Generates a markdown document explaining a custom component or block, its props, and how to use it. Follows project pattern (e.g. slider-layout-seo/docs). Use when the user asks to document a component, create README for a component, or how to use a block.
---
# Component Documentation

## When to use

- User asks to document a component, create README for a block, or "how to use this component".
- Target: custom React components or VTEX Store Framework blocks in this repo (e.g. under `react/`, app folders like `slider-layout-seo/`, or blocks in `store/blocks/`).

## Where to save

- **VTEX app / block with its own folder**: create or update `docs/README.md` inside that folder (e.g. `slider-layout-seo/docs/README.md`).
- **Project-level or shared component**: create or update under `docs/` at repo root, or next to the component with a clear name (e.g. `ComponentName.md`).

## Document structure

Follow the pattern used in [slider-layout-seo/docs/README.md](slider-layout-seo/docs/README.md):

1. **Title** (H1): component or block name.
2. **Short description**: one or two sentences on what it does and when to use it.
3. **Configuration** (if VTEX block):
   - Steps to add to theme (manifest vendor, dependencies).
   - Where to add the block (template).
4. **Block list** (if multiple blocks): table with block name and brief description.
5. **Usage example**: JSON example of the block in a template (with required children if any).
6. **Props**: table(s) with Prop name, Type, Description, Default value. For nested objects, add a subsection and sub-table.
7. **Advanced configuration** (optional): non-basic use cases, composition, constraints.
8. **Customization** (if applicable): CSS handles table and link to VTEX customization docs.

## Content rules

- Write in clear Portuguese (BR) or English, matching the rest of the project docs.
- Infer props and types from the component code (React props, `interfaces.json`, content schemas); do not invent props.
- Keep examples valid: block names and structure must match the actual implementation.
- If the component does not have some sections (e.g. no CSS handles), omit them.

## Process

1. Identify the component or block (from open files, path, or user indication).
2. Read its implementation: props, default values, children, interfaces.
3. Generate the README (or doc file) using the structure above and save to the chosen path.
4. Confirm the file path and mention any section that was skipped because it did not apply.
