---
name: prettier-format
description: Applies consistent code formatting with Prettier to specified or changed files. Uses project config (.prettierrc). Use when the user asks to format with Prettier, run Prettier, or standardize formatting.
---
# Prettier Format

## Quick start

1. Identify target files: those the user specified, or files changed in the current context (e.g. from conversation or open editors).
2. Respect project config: read [.prettierrc](.prettierrc) at repo root. This project uses `@vtex/prettier-config`; do not override its options unless the user asks.
3. Run Prettier on the target files via terminal:
   - Format specific files: `npx prettier --write <path(s)>`
   - Check only (no write): `npx prettier --check <path(s)>` when user wants to verify without changing.
4. If the user did not specify paths, suggest or apply formatting to the files that were discussed or edited in the conversation.

## Scope

- Apply to supported extensions (JS, JSX, TS, TSX, JSON, CSS, MD, etc.) as per Prettier defaults and project ignore files.
- If `.prettierignore` exists, respect it; do not format ignored paths.

## Output

- After running `--write`, confirm which files were formatted.
- If Prettier reports errors (e.g. syntax), show the message and do not overwrite; suggest fixing the code first.
