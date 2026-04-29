# Transparency in Agent Planning

**Principle:** Explicitly show the agent's planning steps. Don't hide reasoning behind abstractions.

## Why

When agent behavior is opaque, debugging is guesswork. Transparent planning lets you:
- Diagnose *where* in the reasoning chain things went wrong.
- Verify the agent understood the task before it acts.
- Build user trust by showing intent before execution.

## How to Apply

- Have agents output their plan before executing.
- Log each decision point: what tool was selected, why, what alternatives were considered.
- Surface intermediate results, not just final output.
- When using frameworks, ensure you can inspect underlying prompts and responses.

### Structured State Tracking for Long-Horizon Tasks

For agents that run across many steps or multiple context windows:
- **Structured formats** (JSON, markdown tables) for state data like test results or task status — helps the model understand schema requirements.
- **Git commits** as checkpoints — provides a log of what's been done and rollback points.
- **Unstructured text** for progress notes — freeform notes work well for tracking general reasoning and next steps.

### Research with Competing Hypotheses

For complex information-gathering tasks, have the agent:
- Develop several competing hypotheses as it gathers data.
- Track confidence levels in progress notes to improve calibration.
- Regularly self-critique its approach and update a hypothesis tree.
- Break down complex research systematically rather than pursuing a single thread.

## Example

Opaque — user sees only the final result:
```
Agent: Here's your refactored code. [final output]
```

Transparent — planning steps visible:
```
Agent:
1. Reading the current file to understand structure...
2. Found 3 functions that share duplicated validation logic.
3. Plan: Extract shared validation into a helper, update all 3 callers.
4. Modifying src/handlers/create.ts — replacing inline validation with validate()
5. Modifying src/handlers/update.ts — same change
6. Modifying src/handlers/delete.ts — same change
7. Running tests to verify no regressions...
   All 42 tests pass.
```

The transparent version lets you catch mistakes at step 3 (wrong plan) instead of discovering them in the final output.

## Sources

- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — "Prioritize transparency by explicitly showing the agent's planning steps"
- [Anthropic Prompting Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — State management, research patterns for long-horizon agents
