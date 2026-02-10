---
name: refactor-cleanup
description: Removes dead code and obsolete comments within the scope of current changes and goals, without changing behavior. Use when the user asks to clean up code, remove comments, refactor around the changes, or remove unused code.
---
# Refactor Cleanup

## Scope

- Limit changes to the **scope of current work**: files and areas that are part of the user’s stated goal or recent edits. Do not refactor unrelated files unless the user asks.
- **Do not change behavior**: no logic changes, no new features, no fixes. Only remove what is unused or redundant.

## What to remove

1. **Dead code**
   - Unused variables, constants, functions, or components (not referenced anywhere in the project or in the same file).
   - Unused imports (JS/TS/JSX/TSX).
   - Unused CSS classes or rules that are not referenced in markup or JS (confirm before removing in shared styles).
2. **Obsolete comments**
   - Commented-out code blocks that are no longer needed.
   - Comments that only repeat what the code does (redundant).
   - TODO/FIXME only if the user explicitly asked to remove them; otherwise leave or list them.
- **Do not remove**
   - Comments that explain non-obvious behavior, business rules, or workarounds.
   - Legal or attribution headers unless the user asks.
   - Code that is still referenced (e.g. from another block or app).

## Process

1. Identify the set of files in scope (from user goal or recent edits).
2. For each file, list candidates for removal (unused code, obsolete comments).
3. Remove them in one or more edits; after each removal, behavior must remain the same (no functional change).
4. If unsure whether something is used (e.g. re-export, dynamic import), do not remove; either ask or note for the user.

## Output

- Briefly list what was removed (e.g. "Removed 3 unused imports and 2 commented blocks in X.jsx").
- If nothing was found to remove, say so and confirm scope.
