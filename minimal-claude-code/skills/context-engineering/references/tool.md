# Effective Tool Design Principles

Principles for building tools that LLMs can use effectively.

## Self-Containment

Tools should be robust and clear in purpose, similar to well-designed functions in a codebase.

**Key requirements:**
- Each tool has a distinct, non-overlapping function
- A human could definitively say which tool to use for a given task
- Tools don't require external context to understand their purpose
- Each tool works independently without implicit dependencies

## Parameter Design

### Naming

- Use descriptive, unambiguous names (`user_id` not `user`, `created_after` not `date`)
- Play to the model's inherent strengths (natural language understanding)
- Avoid abbreviations that require domain knowledge

### Descriptions

- Include helpful examples in parameter descriptions
- Specify formats explicitly (`YYYY-MM-DD`, `user@domain.com`)
- Document constraints (min/max values, allowed characters)
- Show what valid inputs look like

### Types

- Use JSON Schema for input validation
- Leverage enums for constrained choices
- Make required vs optional explicit

## Response Design

### Signal Density

Return only high-signal information. Every token returned should contribute to the agent's decision-making.

**Good:** `{"status": "success", "user_count": 42}`
**Bad:** `{"status": "success", "message": "The operation completed successfully", "timestamp": "...", "request_id": "...", "user_count": 42, "metadata": {...}}`

### Identifiers

Use semantically meaningful identifiers over opaque UUIDs when possible:
- `orders/2024/march/invoice-1234` > `a1b2c3d4-e5f6-...`
- Include human-readable context in IDs

### Pagination and Filtering

- Implement pagination for large result sets
- Support filtering to reduce irrelevant results
- Consider a `response_format` enum (concise vs detailed)
- Default to concise; let agents request more when needed

### Truncation

For text-heavy responses, truncate with clear indicators:
- Show beginning and end of long content
- Include total length and what was omitted
- Provide a way to fetch full content if needed

## Error Handling

Craft error messages that steer toward solutions:

**Good:**
```
Invalid date format. Expected YYYY-MM-DD, got "march 15".
Example: 2024-03-15
```

**Bad:**
```
Error: Invalid input
```

**Principles:**
- Show the correct format
- Include an example of valid input
- Suggest alternative approaches when applicable
- Distinguish between user errors and system failures

## Anti-Patterns

### Tool Bloat

Wrapping every API endpoint as a separate tool overwhelms the agent. Curate a minimal viable set that covers common use cases.

### Ambiguous Boundaries

If two tools could plausibly handle the same request, the agent will struggle. Ensure clear, non-overlapping purposes.

### Verbose Defaults

Returning full objects when only a field is needed wastes context. Default to minimal responses.

### Hidden Dependencies

Tools that require calling other tools first without documenting this create confusion. Make dependencies explicit.

### Cryptic Outputs

Returning raw IDs or codes without context forces agents to make additional calls. Include enough context to act on results.

## Testing Tool Descriptions

The quality of tool descriptions directly impacts agent performance:

1. Have the agent describe when it would use each tool
2. Present ambiguous scenarios and check tool selection
3. Let agents suggest improvements to descriptions
4. Track which tools are over/under-used

## Summary

A well-designed tool:
- Has a clear, unique purpose
- Uses descriptive parameter names with examples
- Returns minimal, high-signal responses
- Provides actionable error messages
- Works independently without hidden dependencies
