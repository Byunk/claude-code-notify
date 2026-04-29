# Multi-Window State Management

**Principle:** For long-running agentic tasks that span multiple context windows, design explicit state serialization, handoff protocols, and structured progress tracking.

## Why

Claude 4.6 has exceptional long-horizon reasoning and can track its remaining context window. But when tasks exceed a single window, state must be externalized. Without structured handoff, the agent loses progress, repeats work, or diverges from its original plan. The model natively supports multi-window workflows when given the right scaffolding.

## How to Apply

- **Use different prompts for the first window vs continuations.** The first window sets up a framework (write tests, create setup scripts). Continuation windows iterate on a todo-list.
- **Write tests in structured format early.** Ask the agent to create tests before starting work and track them in a structured file (e.g., `tests.json`). Remind: "It is unacceptable to remove or edit tests."
- **Create setup scripts.** Encourage `init.sh`-style scripts for starting servers, running test suites, and linters — prevents repeated setup in each new window.
- **Choose "start fresh" over compaction when appropriate.** Claude 4.6 is effective at discovering state from the filesystem. A fresh window with "Review progress.txt, tests.json, and git logs" can outperform compacted context.
- **Use git as a checkpoint mechanism.** Commits provide a log of work done and rollback points that survive context window resets.
- **Prompt for full context usage.** "This is a very long task. Continue working systematically until completion. Don't stop early due to token budget concerns — your context will be compacted automatically."

## Example

State tracking files for a multi-file refactoring agent:

```json
// tests.json — structured state
{
  "tests": [
    { "id": 1, "name": "auth_flow", "status": "passing" },
    { "id": 2, "name": "user_mgmt", "status": "failing" },
    { "id": 3, "name": "api_endpoints", "status": "not_started" }
  ],
  "total": 200,
  "passing": 150,
  "failing": 25,
  "not_started": 25
}
```

```markdown
// PROGRESS.md — unstructured progress notes
Session 3 progress:
- Fixed authentication token validation
- Updated user model to handle edge cases
- Next: investigate user_mgmt test failures (test #2)
- Note: Do not remove tests — this could mask missing functionality
```

Continuation window system prompt:
```
Your context window was compacted. To resume:
1. Run pwd — you can only read/write files in this directory.
2. Review PROGRESS.md, tests.json, and git log.
3. Run the test suite before implementing new features.
4. Pick up from where the previous session left off.
```

## Sources

- [Anthropic Prompting Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — Multi-context window workflows, state management, context awareness
- [Memory Tool](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/memory-tool) — Seamless context transitions across windows
