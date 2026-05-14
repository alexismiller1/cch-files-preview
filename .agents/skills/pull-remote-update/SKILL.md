---
name: pull-remote-update
description: Pull latest changes from the upstream git remote. Use when the user types /pull-remote-update or asks to sync with the upstream template repository.
---

# Pull Remote Update

This skill pulls the latest changes from the `upstream` git remote into the current branch.

## Steps

1. Check if the `upstream` remote exists:
   ```bash
   git remote -v
   ```

2. If `upstream` does not exist, add it using the known upstream URL:
   ```bash
   git remote add upstream git@github.com:Adobe-Prototype/cc-home-template-00f54.git
   ```

3. Fetch from upstream:
   ```bash
   git fetch upstream
   ```

4. Pull from upstream's default branch (usually `main`):
   ```bash
   git pull upstream main
   ```
   If that fails, try `master`:
   ```bash
   git pull upstream master
   ```

5. Report the result to the user — what changed, any conflicts, or confirmation that the branch is already up to date.

## Conflict handling

If there are merge conflicts after `git pull upstream`, list the conflicting files and ask the user how they'd like to resolve them before proceeding. Do NOT auto-resolve conflicts.

## Notes

- Always run `git status` before and after to give the user a clear picture of state.
- Never force-push or use `--force` as part of this skill.
- Only pull into the current local branch; do not switch branches.
