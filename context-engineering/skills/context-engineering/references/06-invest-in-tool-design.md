# Invest in Tool Design (Agent-Computer Interface)

**Principle:** Tool descriptions deserve as much design effort as user interfaces. Poka-yoke your tools — make misuse structurally difficult.

## Why

When an agent calls a tool, the tool description *is* the context the model uses to decide how and when to invoke it. Vague or incomplete tool descriptions cause wrong tool selection, malformed arguments, and wasted iterations.

## How to Apply

- Write tool descriptions like API docs: include purpose, parameters, examples, edge cases.
- Make invalid states unrepresentable in tool parameters (e.g., require absolute paths instead of allowing relative ones).
- Test tools with actual model usage, not just human review.
- Draw clear boundaries between similar tools so the model knows which to pick.

### Calibrate Action Language (Claude 4.6+)

- **Be explicit about intended actions.** "Change this function" triggers tool use; "Can you suggest changes" may only produce text suggestions. Use direct action language when you want the model to act.
- **Tune proactivity.** Use `<default_to_action>` to make the model implement changes rather than describe them. Use `<do_not_act_before_instructions>` to make it research-first and only act on explicit requests.
- **Optimize parallel tool calling.** Claude 4.6 excels at parallel execution. Prompt with "make all independent tool calls in parallel" to boost parallelism to near 100%.
- **Watch for overtriggering.** Instructions like "CRITICAL: You MUST use this tool when..." were needed for older models but cause overtriggering in Claude 4.6. Dial back to normal language: "Use this tool when...".

## Example

Bad tool description:
```json
{
  "name": "search",
  "description": "Searches for things",
  "parameters": { "q": { "type": "string" } }
}
```

Good tool description:
```json
{
  "name": "search_codebase",
  "description": "Search for code patterns across the repository using regex. Returns matching file paths and line numbers. Use this for finding function definitions, imports, or usage patterns. For finding files by name, use `find_files` instead.",
  "parameters": {
    "pattern": {
      "type": "string",
      "description": "Regex pattern to search for (e.g., 'def process_.*payment')"
    },
    "file_type": {
      "type": "string",
      "description": "Limit search to file type: 'py', 'ts', 'go', etc. Omit to search all files."
    },
    "max_results": {
      "type": "integer",
      "description": "Maximum results to return (default: 20). Use lower values for broad patterns.",
      "default": 20
    }
  }
}
```

## Sources

- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — "Invest just as much effort in creating good agent-computer interfaces (ACI)"
- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — "Poka-yoke your tools by redesigning arguments to make mistakes harder"
- [Anthropic Prompting Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — Tool action language, parallel calling, overtriggering in Claude 4.6
