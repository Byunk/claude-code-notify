# Calibrate Autonomy and Safety

**Principle:** Design context that calibrates the agent's action threshold — when to act autonomously vs when to pause and confirm. Claude 4.6 defaults to high autonomy; context must set appropriate guardrails.

## Why

Claude 4.6 is more action-oriented than previous models. Without calibration, it may execute irreversible actions without confirmation, overuse subagent delegation, or take overly broad actions beyond the requested scope. The right balance depends on the use case — a CI bot should act freely, a production deployment agent should confirm every step.

## How to Apply

### Tuning Proactivity

- **High autonomy** — use `<default_to_action>` to make the model implement changes rather than only suggesting them:
  ```
  By default, implement changes rather than only suggesting them.
  If the user's intent is unclear, infer the most useful likely action
  and proceed, using tools to discover any missing details.
  ```
- **Conservative** — use `<do_not_act_before_instructions>` to make the model research-first:
  ```
  Do not jump into implementation unless clearly instructed to make changes.
  Default to providing information and recommendations rather than taking action.
  ```

### Guarding Irreversible Actions

Require confirmation before actions that are:
- **Destructive**: deleting files/branches, dropping tables, rm -rf
- **Hard to reverse**: force-pushing, git reset --hard, amending published commits
- **Visible to others**: pushing code, commenting on PRs, sending messages, modifying shared infrastructure

### Subagent Orchestration Guardrails

Claude 4.6 natively delegates to subagents but may overuse them. Add guidance:
```
Use subagents when tasks can run in parallel, require isolated context,
or involve independent workstreams. For simple tasks, sequential operations,
or single-file edits, work directly rather than delegating.
```

### Scope Boundaries

Add explicit boundaries to prevent scope creep:
```
Only modify files in src/auth/. Do not install new dependencies.
Do not refactor code beyond what's needed for the bug fix.
```

## Example

CI bot — high autonomy:
```
You are a CI assistant. When lint errors are detected:
1. Fix them automatically.
2. Run the test suite.
3. Commit the fix with message "fix: auto-lint [CI]".
No confirmation needed for lint fixes and test runs.
```

Production deployment agent — conservative:
```
You are a deployment assistant. Before any action that modifies
production state, describe what you plan to do and wait for
explicit approval. This includes:
- Running migrations
- Scaling services
- Modifying environment variables
- Deploying new versions
Never proceed with destructive operations without confirmation.
```

## Sources

- [Anthropic Prompting Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — Balancing autonomy and safety, subagent orchestration, overeagerness in Claude 4.6
- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — Human feedback checkpoints, stopping conditions
