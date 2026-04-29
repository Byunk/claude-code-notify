# Ground Agents in Environment Feedback

**Principle:** Use tool results, execution output, and human checkpoints as ground truth — don't rely on model reasoning alone.

## Why

LLMs can hallucinate, drift, or compound errors across steps. Grounding in real environment feedback (actual command output, test results, API responses) provides objective checkpoints that correct the agent's trajectory.

## How to Apply

- After each agent action, verify the result from the environment before proceeding.
- Add human feedback checkpoints at high-stakes decision points.
- Set explicit stopping conditions (iteration limits, success criteria).
- Don't let agents reason about what a tool "probably" returned — make them read the actual output.

## Example

Ungrounded — agent reasons without verification:
```
Agent: I'll create the database migration.
Agent: The migration should work because the schema looks right.
Agent: Deploying to staging.
Agent: Deployment should be successful.
Result: Migration failed silently. Agent didn't check.
```

Grounded — agent verifies at each step:
```
Agent: Creating database migration...
  → Tool result: Migration file created at migrations/003_add_index.sql
Agent: Running migration on test database...
  → Tool result: ERROR — column "user_id" does not exist
Agent: The migration references a column that doesn't exist yet.
       I need to check the current schema first.
  → Tool result: Schema shows column is named "account_id", not "user_id"
Agent: Fixing migration to use "account_id"...
  → Tool result: Migration successful. 1 index created.
Agent: Running test suite to verify...
  → Tool result: 156 tests passed, 0 failed.
```

## Sources

- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — Agents require "ground truth from environment (tool results, execution feedback)" and "human feedback checkpoints"
