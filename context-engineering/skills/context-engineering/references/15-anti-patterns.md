# Avoid Common Anti-Patterns

**Principle:** Know the failure modes of context engineering so you can avoid them.

## Anti-Patterns

### 1. Context Dumping
Loading everything available into the context window without curation.

**Why it fails:** Dilutes signal, increases cost, may push important information outside the attention window.

```
# Bad: Dump entire repo structure, all configs, full git history
context = repo_tree + all_configs + git_log_full + every_readme

# Good: Include only what the task needs
context = relevant_file + direct_dependencies + task_instruction
```

### 2. Framework Over-Abstraction
Using complex agent frameworks that hide the underlying prompts and tool calls.

**Why it fails:** When things go wrong, you can't inspect or debug the actual context being sent. "Incorrect assumptions about what's under the hood are a common source of customer error."

```python
# Bad: Opaque framework magic
agent = MagicFramework(model="claude", tools=all_tools, memory=auto)
agent.run(task)  # What prompt was actually sent? Who knows.

# Good: Explicit control
messages = [system_prompt, user_message]
response = client.messages.create(model="claude", messages=messages, tools=selected_tools)
# You can inspect exactly what was sent and received.
```

### 3. Agents for Simple Tasks
Using autonomous agent loops when a single LLM call or simple chain would suffice.

**Why it fails:** Agents add latency, cost, and error compounding. Each loop iteration is a chance for the agent to go off-track.

### 4. Ignoring Tool Documentation
Providing tools with minimal descriptions, no examples, and unclear parameter semantics.

**Why it fails:** The model can't effectively use tools it doesn't understand. Bad tool docs cause wrong tool selection, malformed arguments, and wasted retries.

### 5. Naked Chunk Retrieval
Retrieving text fragments without surrounding context about what document they came from, when, and why they're relevant.

**Why it fails:** Isolated chunks are ambiguous. "Revenue increased 3%" is meaningless without knowing the company, time period, and comparison baseline.

### 6. Static Context for Dynamic Tasks
Using the same context payload regardless of task complexity or user needs.

**Why it fails:** Simple tasks get bloated context (waste), complex tasks get insufficient context (failure). Context should scale with task demands.

### 7. Overengineering / Overeagerness
Creating extra files, adding unnecessary abstractions, or building in flexibility that wasn't requested. Claude 4.6 is particularly prone to this.

**Why it fails:** Adds complexity, maintenance burden, and file bloat. A bug fix doesn't need surrounding code cleaned up. A simple feature doesn't need extra configurability.

```
# Bad: Asked to fix a null check, also refactors the file
Fix: added null check to getUserName()
Bonus: extracted helper utility, added type annotations to 8 functions,
       created new error handling abstraction...

# Good: Scoped fix
Fix: added null check to getUserName()
```

### 8. Hard-Coding to Tests
Writing solutions that pass specific test inputs rather than implementing general logic.

**Why it fails:** Produces fragile code that breaks on any input not in the test suite. Tests verify correctness — they shouldn't define the solution.

### 9. Stale Aggressive Prompts
Keeping tool instructions written for older, more conservative models (e.g., "CRITICAL: You MUST use this tool", "If in doubt, always use...").

**Why it fails:** Claude 4.6 is significantly more proactive than previous models. Aggressive instructions that compensated for under-triggering now cause over-triggering — the model reaches for tools on every interaction, even when a direct response is sufficient.

```
# Bad: Inherited from older model prompts
"CRITICAL: You MUST use the search tool before answering ANY question"

# Good: Calibrated for Claude 4.6
"Use the search tool when you need information not in the current context"
```

## Sources

- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — Framework warnings, simplicity principle
- [Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval) — Naked chunk retrieval problem
- [Context Engineering 2.0](https://arxiv.org/pdf/2510.26493) — Static context anti-pattern
- [Anthropic Prompting Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — Overeagerness, hard-coding, stale prompt patterns in Claude 4.6
