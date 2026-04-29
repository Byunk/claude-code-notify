# Simple, Composable Patterns

**Principle:** Prefer simple, composable patterns (prompt chaining, routing, parallelization) over complex agent frameworks. Start with the simplest approach that works.

## Why

Complex frameworks introduce abstraction layers that obscure underlying prompts and responses. Debugging becomes harder. Errors compound. Most tasks don't need autonomous agents — they need well-structured workflows.

## How to Apply

Before reaching for an agent framework, ask:
1. Can a single LLM call solve this? Try that first.
2. Can I decompose this into 2-3 chained calls? Use prompt chaining.
3. Do I need to route different inputs differently? Use routing.
4. Can subtasks run independently? Use parallelization.
5. Only if none of the above work: consider an agent loop.

## Example

Task: Generate a blog post, translate it, then create social media snippets.

Over-engineered — full agent with tool use:
```python
agent = Agent(tools=[write_tool, translate_tool, social_tool])
agent.run("Generate blog post, translate to Spanish, create tweets")
# Agent autonomously decides order, retries, tool selection...
```

Composable — prompt chaining:
```python
# Step 1: Generate
blog = llm("Write a blog post about context engineering")

# Step 2: Translate (depends on step 1)
translated = llm(f"Translate to Spanish:\n\n{blog}")

# Step 3: Snippets (depends on step 1, parallel with step 2)
snippets = llm(f"Create 3 tweet-sized summaries:\n\n{blog}")
```

The chained version is easier to debug, test, and modify. Each step has clear inputs and outputs.

## Sources

- [Anthropic Engineering Blog](https://www.anthropic.com/engineering) — "Simple, composable patterns rather than complex frameworks"
- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — "Start by using LLM APIs directly: many patterns can be implemented in a few lines of code"
