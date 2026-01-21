---
name: quick-review
description: Quick code quality check focusing on critical and major issues
argument-hint: File paths or leave empty for recent changes
context: fork
agent: Explore
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(gh:*)
---

## Git context

- Current Branch: !`git branch --show-current`
- Git Status: !`git status --short`
- Diff Stat: !`git diff --stat HEAD`
- Diff: !`git diff HEAD`

## Your task

Perform a context-aware code review. Focus on $ARGUMENTS files.

### Phase 0: Context discovery

Before judging any code, gather context about the project:

1. **Project conventions** - Check CLAUDE.md, README, or similar docs for architectural guidance
2. **Codebase structure** - Understand the directory layout and what layers exist
3. **Existing patterns** - Find where validation, error handling, and similar concerns are typically handled in this codebase

This prevents false positives like flagging "missing validation" when validation is handled at a different layer.

### Phase 1: Intent and approach

Before looking at code details, answer:

- What is this change trying to accomplish?
- Is the approach reasonable for that goal?
- Is there a simpler way to achieve the same thing?
- Does it fit the project's existing patterns?

If the overall approach is wrong, stop here and report that.

### Phase 2: Architectural fit

Evaluate:

- Are responsibilities in the right layers?
- Does it duplicate functionality that exists elsewhere?
- Are cross-cutting concerns (validation, auth, logging, errors) handled consistently with the rest of the codebase?

### Phase 3: Technical review

Only flag issues that are actual problems, not theoretical concerns:

**Critical** (must fix):

- Security flaws not handled elsewhere in the stack
- Logic errors that will cause failures or data corruption
- Breaking changes to public APIs or contracts

**Major** (should fix):

- Approach significantly more complex than necessary
- Responsibilities in the wrong layer (or gaps in the chain)
- Error handling that loses important information
- Performance issues in hot paths

**Important**: Before flagging "missing validation" or "missing error handling", trace the data flow. If validation happens at the API boundary or errors are handled by the caller, don't flag it.

## Output format

```markdown
# Code Review: [Feature/Change Name]

## Overview

[2-3 sentences: What this change does and whether the approach makes sense]

## Issues

### Critical

#### #1: [Issue title] at `file.py:line`

[Description of the issue and why it matters]

**Suggested fix:** [Specific recommendation]

### Major

#### #2: [Issue title] at `file.py:line`

[Description of the issue]

**Suggested fix:** [Specific recommendation]

## Verdict

[Ship it / Address critical issues first / Rethink approach]

[1-2 sentences summarizing overall assessment]

## Summary

1. [Critical] Issue title: file.py:line
2. [Major] Issue title: file.py:line
   ...
```

If no issues found, omit the Issues and Summary sections.
