# Match Architecture to Complexity

**Principle:** Choose the simplest architecture pattern that fits your problem. Each pattern has a sweet spot — don't use agents when chaining suffices.

## Why

Over-engineering increases cost, latency, and error surface. Under-engineering leads to brittle, hard-to-maintain solutions. The key is matching the pattern to the problem's actual complexity.

## How to Apply

| Problem Shape | Pattern | When to Use |
|---------------|---------|-------------|
| Fixed sequential steps | **Prompt Chaining** | Tasks decomposable into predictable subtasks |
| Distinct input categories | **Routing** | Different inputs need fundamentally different handling |
| Independent subtasks | **Parallelization** | Speed gains from concurrent processing |
| Unpredictable decomposition | **Orchestrator-Workers** | Complex tasks where subtasks emerge dynamically |
| Iterative refinement needed | **Evaluator-Optimizer** | Clear evaluation criteria, value in multiple passes |
| Open-ended autonomy | **Agent Loop** | Unpredictable steps, tool use, environment interaction |

## Example

**Prompt Chaining** — marketing copy pipeline:
```
Input → Generate copy → Translate → Format for platform → Output
```

**Routing** — customer support:
```
Input → Classify(billing|technical|general)
  → billing: Billing specialist prompt
  → technical: Technical support prompt + tool access
  → general: FAQ lookup + general prompt
```

**Orchestrator-Workers** — multi-file code change:
```
Orchestrator: "Break this feature request into file-level tasks"
  → Worker 1: Modify database schema
  → Worker 2: Update API endpoint
  → Worker 3: Add frontend component
Orchestrator: "Verify consistency across changes"
```

**Agent Loop** — only when the above patterns can't handle it:
```
while not done:
    observe → think → act (call tools) → check stopping condition
```

## Sources

- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — Detailed breakdown of workflow patterns vs agent patterns
