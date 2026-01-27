# Multi-Agent System Principles

Principles for designing systems where multiple agents coordinate to accomplish tasks.

## Orchestrator-Worker Pattern

The most common multi-agent architecture.

### Structure

```
Orchestrator (Lead Agent)
├── Worker A (focused task)
├── Worker B (focused task)
└── Worker C (focused task)
```

### Orchestrator Role

- Receives user request
- Breaks down into subtasks
- Assigns work to workers
- Synthesizes results
- Handles errors and retries

### Worker Role

- Receives focused task description
- Has clean context window
- Explores extensively within scope
- Returns condensed summary (1000-2000 tokens)
- Signals completion or blockers

### Context Isolation

Search context stays in worker agents. Orchestrator only sees summaries, keeping its context clean for coordination.

## Delegation Principles

### Clear Task Specifications

Each worker needs:
1. **Objective:** What to accomplish
2. **Output format:** How to structure results
3. **Tool guidance:** Which tools are available/preferred
4. **Boundaries:** What's in/out of scope

### Effort Scaling

Match worker effort to task complexity:

| Complexity | Approach |
|------------|----------|
| Simple | 1 agent, 3-10 tool calls |
| Medium | 2-3 agents, parallel exploration |
| Complex | 10+ agents, divided responsibilities |

Provide explicit guidelines so orchestrator can gauge appropriate effort.

### Avoid Vague Delegation

**Bad:** "Look into the authentication system"

**Good:** "Find all files implementing JWT token validation. Return: file paths, key functions, and any security concerns identified."

## Coordination Challenges

### Duplicate Work

Multiple workers may explore overlapping areas. Mitigate by:
- Clear scope boundaries in task descriptions
- Deduplication in result synthesis
- Explicit "do not investigate" constraints

### Coverage Gaps

Workers may each assume another handled an area. Mitigate by:
- Exhaustive task breakdown before delegation
- Verification step checking coverage
- Overlap slightly rather than gap

### Information Loss

"Telephone game" effects as information passes through layers. Mitigate by:
- Workers write to filesystem, not just return text
- Preserve source references
- Allow orchestrator to request clarification

### Coordination Overhead

Time spent coordinating vs doing actual work. Balance by:
- Not over-decomposing simple tasks
- Using parallel tool calls (90% time reduction possible)
- Letting workers handle sub-decomposition

## Context Handoffs

Managing context across agent boundaries and sessions.

### Pre-Truncation Saves

Before context window fills:
1. Summarize current state
2. Save to external storage
3. Continue with reference to saved state

### Fresh Agent Spawning

When limits approach:
1. Spawn new agent with clean context
2. Pass essential context (decisions, open questions)
3. Include pointer to detailed notes
4. Terminate full-context agent

### Filesystem as Memory

Workers output to files rather than just returning text:
- Preserves full fidelity
- Enables async consumption
- Survives agent termination
- Allows selective loading

### Lightweight References

Pass between agents:
- File paths to detailed content
- Query patterns for retrieval
- Summary with "see X for details"

## Architecture Patterns

### Fan-Out/Fan-In

```
Orchestrator ─┬─> Worker A ─┐
              ├─> Worker B ─┼─> Orchestrator (synthesis)
              └─> Worker C ─┘
```

Best for: Parallel search, independent analysis, batch processing.

### Pipeline

```
Worker A ─> Worker B ─> Worker C ─> Result
```

Best for: Sequential transformations, refinement chains.

### Hierarchical

```
Lead ─┬─> Manager A ─┬─> Worker A1
      │              └─> Worker A2
      └─> Manager B ─┬─> Worker B1
                     └─> Worker B2
```

Best for: Large-scale tasks, domain specialization.

## Summary

Effective multi-agent systems:
- Are used when parallelization or context overflow justifies overhead
- Employ orchestrator-worker pattern with clean context separation
- Provide clear, bounded task specifications to workers
- Return condensed summaries rather than raw results
- Use filesystem for persistent handoffs
- Scale coordination effort to task complexity
