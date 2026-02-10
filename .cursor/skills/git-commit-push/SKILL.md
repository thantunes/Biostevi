---
name: git-commit-push
description: Generates commit messages from git diff following Conventional Commits, guides through push, and creates PRs via GitHub CLI when requested. Use when the user asks to commit, create a commit message, push, create a PR, or do commit and push.
---
# Git Commit and Push

## Commit message

1. Inspect staged (and when relevant unstaged) changes: run `git status` and `git diff --staged` (and `git diff` if including unstaged).
2. Write a single commit message in **Conventional Commits**:
   - Format: `<type>(<scope>): <short description>`
   - Optional body: blank line, then one or more paragraphs explaining what and why (not how).
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`. Use `feat` for user-facing features, `fix` for bug fixes.
   - Scope: optional; use when it helps (e.g. component or area: `header`, `pdp`, `slider-layout-seo`).
3. Short description: imperative, lowercase start, no period at end (e.g. "add FAQ block", "fix product price alignment").
4. If the user wants the agent to commit: run `git add` for the intended paths (or confirm already staged), then `git commit -m "<message>"`. If the user only asked for a message, output the message and do not run commit unless they confirm.

## Push

- When the user asks for push (or "commit and push"):
  1. After commit (or confirm latest commit is the one to push).
  2. Run `git push` (or `git push <remote> <branch>` if context indicates a specific remote/branch).
- If push fails (e.g. no upstream, permission), report the error and suggest next steps (e.g. set upstream, check remote).

## Create PR (GitHub)

- When the user asks to create a PR (via bash/CLI):
  1. Require **GitHub CLI** (`gh`). If `gh` is not installed, instruct: install from https://cli.github.com/ and run `gh auth login`.
  2. Ensure the branch is pushed (run `git push` or `git push -u origin <branch>` if needed).
  3. Run `gh pr create` with:
     - Title: prefer format `task0123: <type>: <short description>` (e.g. `task0123: feat: Adiciona login social com Google`). Use Conventional Commits type when no task id.
     - Body: use the project PR template (Tipo de Mudança, Descrição, Evidências, Checklist, Referências) when the user provides it or when it exists in the repo (e.g. `.github/PULL_REQUEST_TEMPLATE.md`).
  4. Examples:
     - `gh pr create --title "task0123: feat: Adiciona login social" --body "## Descrição\n..."`
     - `gh pr create` (opens editor for title/body)
     - `gh pr create --fill` (fills title/body from commits)
  5. If `gh` is not available, suggest installing it and creating the PR in the browser from the repo’s “Compare & pull request” link.

## Rules

- Do not amend or force-push unless the user explicitly asks.
- Do not commit without explicit user request to commit; generating the message alone is safe.
