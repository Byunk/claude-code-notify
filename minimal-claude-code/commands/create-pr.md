---
name: create-pr
description: Create a GitHub PR from the current feature branch
argument-hint: "[--base <branch> | --draft | --title <title>]"
disable-model-invocation: true
allowed-tools: Bash(git:*), Bash(gh:*), Read, Grep, Glob, AskUserQuestion
---

# Create PR

Create a GitHub PR from the current branch with a convention-aware title and body.

This command has remote side effects: it may push the current branch and create a PR on GitHub. Do not push or create the PR until the user explicitly approves the PR description and confirms creation.

## Arguments

Parse `$ARGUMENTS` before gathering context:

- `--base <branch>`: use this branch as the PR base.
- `--branch <branch>`: alias for `--base <branch>`.
- `--draft`: create the PR as a draft.
- `--title <title>`: include this title as the first title suggestion.

If `$ARGUMENTS` contains an unknown flag or a flag missing a required value, report valid usage and stop.

## Interactive Questions

Use the built-in `AskUserQuestion` tool for every question that needs user input. It is a tool, not a skill. Do not ask selection or follow-up questions as plain chat text, and do not say that the `AskUserQuestion` skill is unavailable.

Use `AskUserQuestion` when:

- Selecting or confirming the base branch.
- Uncommitted changes exist and the user must decide whether to continue.
- The generated PR title needs user selection or editing.
- The generated PR description needs explicit approval.
- The final push and PR creation needs confirmation.

## Step 1: Select and Validate Base Branch

Confirm the working tree is on a feature branch and has commits to submit.

1. Get the current branch:
   ```bash
   git branch --show-current
   ```
2. Resolve the base branch explicitly:
   - List local branches:
     ```bash
     git branch --format='%(refname:short)'
     ```
   - If `--base` or `--branch` was provided, include that value as the first option.
   - Otherwise, if a likely default branch is known from `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`, put it first.
   - Ask the user `Which base branch should I create the PR against?` using `AskUserQuestion`.
   - Show branch choices as single-select options.
   - If the user provides free-form input, treat it as the base branch.
3. If the current branch is the base branch, output `Nothing to submit -- current branch is the base branch.` and stop.
4. Fetch the base branch:
   ```bash
   git fetch origin <base> --quiet
   ```
5. Count commits ahead:
   ```bash
   git rev-list --count origin/<base>..HEAD
   ```
6. Check local changes:
   ```bash
   git status --short
   ```

If there are zero commits ahead and no uncommitted changes, output `Nothing to submit -- no commits ahead of base branch.` and stop.

If there are uncommitted changes, tell the user that uncommitted changes will not be included in the PR. Ask whether to continue using the built-in `AskUserQuestion` tool. If the user declines, stop.

## Step 2: Learn PR Conventions

Examine recent merged PRs to infer the repository's PR style:

```bash
gh pr list --state merged --limit 5 --json title,body,number
```

Analyze the returned PRs for:

- Title format: prefixes such as `feat:`, `fix:`, ticket IDs, capitalization, and length.
- Body structure: section headings, checklist patterns, issue links, and test-plan conventions.

If no merged PRs exist or `gh pr list` fails, use a concise default body with `Summary` and `Review guide`.

## Step 3: Gather Diff and Commit History

Collect enough context to write the PR:

```bash
git log --oneline origin/<base>..HEAD
git log --format="%h %s%n%n%b" origin/<base>..HEAD
git diff --stat origin/<base>...HEAD
git diff origin/<base>...HEAD
```

For large diffs, focus on `git diff --stat` and read changed files selectively. Do not paste long raw diffs into the final response.

## Step 4: Generate and Confirm PR Title

Generate 2-3 title suggestions from the conventions and branch diff, then ask the user to choose or edit the title.

Title rules:

- Match the repository's recent PR convention.
- If `--title` was provided, include it as the first suggestion.
- If no convention is detected, use a concise imperative title.
- Keep the title under 72 characters.

Use one `AskUserQuestion` single-select question:

- `header`: `Title`
- `question`: `Which PR title should I use? Select one below, or type an edited title.`
- `options`: one option per suggested title
- `multiSelect`: `false`

If the user types free-form input, use that as the final title.

## Step 5: Generate and Approve PR Description

Generate a PR description that fits this repository and this change. No single PR body format is appropriate for every repository or every change, so choose the smallest useful structure based on recent merged PRs, the commit history, and the diff.

Prefer repository convention when it is clear. Otherwise follow these conventional PR best practices:

- Make the first section explain why the change exists and what changed.
- Include review guidance when it materially helps the reviewer know where to start.
- Include validation or test notes when tests, manual verification, migrations, generated files, or release risk matter.
- Include screenshots, rollout notes, breaking changes, linked issues, or follow-up notes only when the diff or repository convention calls for them.
- Avoid a rigid template when a short description is clearer.
- Do not list every changed file.
- Keep the description concise enough for a reviewer to scan quickly.

Useful fallback shapes:

```markdown
## Summary

<1-2 concise paragraphs describing the reason and change.>

## Review guide

- **Start here**: `path/to/key-file.ext` -- <why this is the core change>
- <Optional additional review pointer>
```

or:

```markdown
## Summary

<1-2 concise paragraphs describing the reason and change.>

## Validation

- <Test, build, or manual validation performed or expected.>
```

After generating the description, show the full proposed description and ask for explicit approval with `AskUserQuestion`:

- `header`: `Description`
- `question`: `Use this PR description? Select approve, or type requested edits.`
- Options:
  - `Approve description`
  - `Regenerate description`
- `multiSelect`: `false`

If the user types requested edits, revise the description once using those edits and ask for approval again. Do not create the PR until the user approves the final description.

## Step 6: Confirm and Create PR

Before any remote side effect, show:

- Base branch
- Current branch
- Draft mode status
- Final title
- Approved description

Ask for confirmation with the built-in `AskUserQuestion` tool. If the user does not confirm, stop without pushing or creating a PR.

After confirmation:

1. Push the current branch:
   ```bash
   git push -u origin <current-branch>
   ```
2. Create the PR:
   ```bash
   gh pr create --base <base-branch> --title "<title>" --body "$(cat <<'EOF'
   <body>
   EOF
   )"
   ```
   Add `--draft` when requested.
3. Output the PR URL returned by `gh pr create`.

If `git push` or `gh pr create` fails, report the exact failure and stop.
