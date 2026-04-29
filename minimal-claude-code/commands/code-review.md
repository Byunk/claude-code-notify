---
name: code-review
description: Context-aware code review with explicit review target selection
argument-hint: "[--base <branch> | --uncommitted | --commit <ref> | --custom <instruction>]"
allowed-tools: Bash(git:*), AskUserQuestion, Agent(code-reviewer)
---

# Code Review

Orchestrate a code review, then delegate the actual review to the `code-reviewer` agent so review exploration stays in a separate context.

Do not perform the review in this command context. Resolve the review mode and target first, then call the `Agent` tool with `agent_type: code-reviewer`. Relay the agent's final review output verbatim.

## Mode Flags

Users may pass a mode flag in `$ARGUMENTS` to skip the mode-selection question:

- `--base <branch-or-ref>`: review against a base branch or ref.
- `--uncommitted`: review staged and unstaged local changes.
- `--commit <sha-or-ref>`: review one commit.
- `--custom <instruction>`: review using the provided target and instruction.

Aliases:

- `--branch <branch-or-ref>` means `--base <branch-or-ref>`.
- `--local` means `--uncommitted`.
- `--ref <sha-or-ref>` means `--commit <sha-or-ref>`.

If `$ARGUMENTS` contains exactly one valid mode flag with the required value, use that mode immediately and do not ask the mode-selection question. If the selected mode is missing its required value, ask only for the missing value using the built-in `AskUserQuestion` tool.

If `$ARGUMENTS` contains multiple mode flags or an unknown mode flag, report the valid usage and ask the user to choose a mode using the built-in `AskUserQuestion` tool.

## Interactive Questions

Use the built-in `AskUserQuestion` tool for every question that needs user input. It is a tool, not a skill. Do not ask selection or follow-up questions as plain chat text, and do not say that the `AskUserQuestion` skill is unavailable.

Use `AskUserQuestion` when:

- No valid mode flag was provided and the user must choose a review mode.
- A selected mode is missing a required value such as a branch, commit, ref, target, or instruction.
- A custom review target is unclear and needs one concise clarification.

## Step 0: Select Review Mode

First parse `$ARGUMENTS` for the mode flags above.

If no valid mode flag is present, explicitly call the `AskUserQuestion` tool with the question `Which review mode should I use? Select a mode below, or type a custom review target/instruction.` Ask the user to choose exactly one of these mode options or provide custom input:

1. Review against a base branch
2. Review uncommitted changes
3. Review a commit

The tool input must use one single-select question in this shape. Do not include a fourth custom option; rely on the user's free-form response for custom review instructions.

```json
{
  "questions": [
    {
      "header": "Mode",
      "question": "Which review mode should I use? Select a mode below, or type a custom review target/instruction.",
      "options": [
        {
          "label": "Review against a base branch",
          "description": "Compare the current branch against a base branch or ref."
        },
        {
          "label": "Review uncommitted changes",
          "description": "Review staged and unstaged local changes."
        },
        {
          "label": "Review a commit",
          "description": "Review one commit by SHA, tag, or ref."
        }
      ],
      "multiSelect": false
    }
  ]
}
```

If the user types free-form input instead of selecting one of the three options, treat that response as `custom` mode.

After the user chooses:

- **Review against a base branch**: use the value from `--base`/`--branch`, or use `git branch --format='%(refname:short)'` to list local branches and then use `AskUserQuestion` to ask for the base branch if it was not provided. Only show local branches in the branch options. Do not show remote branches or arbitrary refs in the branch selector.
- **Review uncommitted changes**: use this mode immediately when `--uncommitted` or `--local` is present.
- **Review a commit**: use the value from `--commit`/`--ref`, or use `AskUserQuestion` to ask for the commit SHA, tag, or ref if it was not provided.
- **Custom free-form input**: use the value from `--custom` or the user's free-form response as the review target and instruction. If the target is unclear, use `AskUserQuestion` to ask one concise follow-up before delegating.

Print `Reviewing in <mode> mode` once the target is clear.

When asking for a missing base branch, use one single-select `AskUserQuestion` question with:

- `header`: `Branch`
- `question`: `Which local branch should I review against?`
- `options`: one option per branch returned by `git branch --format='%(refname:short)'`
- `multiSelect`: `false`

## Step 1: Delegate Review

Call the `Agent` tool with `agent_type: code-reviewer`.

Pass this task description to the agent:

```markdown
Run a read-only code review.

Mode: <base | uncommitted | commit | custom>
Target: <branch/ref/commit/custom instruction, or "HEAD working tree" for uncommitted>
Original arguments: $ARGUMENTS

Use the mode and target above as the source of truth. Gather the relevant git context yourself, inspect changed files in context, and return findings only in the required code review format.
```

Do not send raw diffs or changed file contents unless the user provided them directly as custom input. The `code-reviewer` agent should gather the diff and nearby context in its own context window.

## Step 2: Return Result

When the `code-reviewer` agent finishes, relay its final output verbatim. Do not add extra findings, summaries, or commentary from this command context.
