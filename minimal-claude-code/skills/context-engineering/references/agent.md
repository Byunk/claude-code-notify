# Effective Agent Design Principles

Principles for designing agent with optimal context usage.

## System Prompt Altitude

Balance between rigid hardcoded logic and vague guidance.

### Too Rigid (Low Altitude)

```
If user says "hello", respond with "Hi there!"
If user asks about weather, call weather_api with location parameter
If user mentions "error", ask for the error message
```

Problems: Brittle, doesn't generalize, breaks on variations.

### Too Vague (High Altitude)

```
Be helpful and use tools when appropriate.
```

Problems: No guidance on tool selection, inconsistent behavior.

### Right Altitude

```
Use search tools to find information before answering factual questions.
When multiple sources conflict, prefer official documentation over forums.
If a query is ambiguous, ask one clarifying question before proceeding.
```

Specific enough to guide behavior, flexible enough to serve as heuristics.

### Structure

- Use XML tags or Markdown headers to delineate sections
- Separate background info from behavioral instructions
- Group tool guidance together
- Place output format expectations at the end

## Just-in-Time Retrieval

Maintain lightweight identifiers; load data dynamically at runtime.

### Identifiers Over Data

Keep in context:
- File paths, not file contents
- Query patterns, not query results
- API endpoints, not API responses
- Document IDs, not document text

### Leveraging Metadata

Use readily available signals before loading full content:
- File names hint at purpose
- Directory structure reveals organization
- Timestamps indicate recency
- File sizes suggest complexity

### Hybrid Strategy

Combine approaches:
1. Upfront retrieval for speed on known patterns
2. Autonomous exploration for discovery of unknowns

## Progressive Disclosure

Let agents incrementally discover context through exploration.

### Exploration Flow

1. Start with high-level overview (directory listing, index)
2. Drill into relevant areas based on task
3. Load detailed content only when needed
4. Each interaction yields context for the next decision

### Self-Managed Context

The agent decides what's relevant, keeping focus on the useful subset rather than loading everything upfront.

### Information Architecture

Structure information to support progressive discovery:
- Indices that summarize what's available
- Clear naming that hints at content
- Logical groupings that match common queries

## Compaction Strategies

When context grows large, compress while preserving critical information.

### What to Preserve

- Architectural decisions made
- Unresolved bugs and edge cases
- Key implementation details
- User preferences expressed
- Dependencies between components

### What to Discard

- Redundant tool outputs (keep summary, drop raw data)
- Verbose intermediate messages
- Exploratory dead ends
- Repeated information

### Compaction Approaches

**Tool result clearing:** Lightest touch. Remove raw tool outputs after extracting key findings.

**Conversation summarization:** Condense dialogue while preserving decisions and open questions.

**Checkpoint creation:** Save state to external file, start fresh context with checkpoint reference.

### Tuning

Start with maximum recall (keep everything), then iterate to improve precision based on what actually gets used.

## Structured Note-Taking

Persist information outside the context window for later retrieval.

### Use Cases

- To-do lists tracking remaining work
- NOTES.md capturing decisions and rationale
- Dependency graphs showing what blocks what
- Progress logs for long-running tasks

### Benefits

- Survives context window limits
- Can be pulled back selectively
- Creates audit trail
- Enables handoffs between sessions

### Implementation

1. Agent writes notes to persistent storage (file, database)
2. Notes include enough context to be useful later
3. Agent retrieves notes when resuming or when relevant
4. Notes are updated as work progresses

## Example Curation

Provide diverse, canonical examples rather than exhaustive rules.

### Examples Over Rules

**Less effective:**
```
Handle errors gracefully. Check for null values.
Validate inputs before processing. Use try-catch blocks.
Log errors with context. Return meaningful error messages.
```

**More effective:**
```
Example: Handling a missing user

Input: get_user(id="nonexistent")

Response: "User 'nonexistent' not found.
To list available users, try list_users().
To create a new user, try create_user(name='...')."
```

### Example Selection

- Cover the most common patterns
- Show edge cases that frequently cause errors
- Demonstrate the expected reasoning process
- Include both positive and negative examples

### Why Examples Work

For LLMs, examples function like "pictures worth 1000 words." They communicate:
- Expected format
- Appropriate level of detail
- Reasoning patterns
- Edge case handling

All in a form the model can pattern-match against.

## Summary

An effective single-agent system:
- Uses system prompts at the right altitude
- Keeps lightweight references, loads data just-in-time
- Lets the agent discover context progressively
- Compacts aggressively to preserve context budget
- Maintains external notes for long-horizon tracking
- Demonstrates behavior through canonical examples
