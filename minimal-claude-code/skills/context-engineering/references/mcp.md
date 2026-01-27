# MCP Design Principles

Best practices for designing Model Context Protocol servers that agents can use effectively.

## Tool Definition

### Clear Descriptions

Tool descriptions are the primary way agents understand capabilities. Write them for LLM consumption:

```json
{
  "name": "search_documents",
  "description": "Search documents by content. Returns matching excerpts with context. Use for finding specific information within documents. For listing all documents, use list_documents instead."
}
```

Include:
- What the tool does
- When to use it
- When NOT to use it (if ambiguous with other tools)

### Input Schema

Use JSON Schema with clear constraints:

```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "Search terms. Supports AND/OR operators. Example: 'budget AND 2024'"
    },
    "limit": {
      "type": "integer",
      "default": 10,
      "minimum": 1,
      "maximum": 100,
      "description": "Maximum results to return"
    }
  },
  "required": ["query"]
}
```

### Output Schema

Define structured outputs when possible:

```json
{
  "outputSchema": {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "document_id": {"type": "string"},
        "excerpt": {"type": "string"},
        "relevance_score": {"type": "number"}
      }
    }
  }
}
```

Benefits:
- Agents understand response structure
- Enables structured content in responses
- Facilitates automated processing

### Unique Naming

- Use descriptive, action-oriented names
- Avoid generic names that could conflict

## Response Efficiency

### Minimal Payloads

Return only what agents need to make decisions:

**Good:**
```json
{
  "files": ["auth.py", "users.py"],
  "total": 2
}
```

**Bad:**
```json
{
  "status": "success",
  "timestamp": "2024-03-15T10:30:00Z",
  "request_id": "abc123",
  "files": [
    {"name": "auth.py", "size": 1234, "created": "...", "modified": "...", "permissions": "..."},
    {"name": "users.py", "size": 5678, "created": "...", "modified": "...", "permissions": "..."}
  ],
  "metadata": {"server": "...", "version": "..."}
}
```

### Pagination

For large result sets:

```json
{
  "results": [...],
  "next_cursor": "abc123",
  "has_more": true,
  "total_count": 1000
}
```

- Default to reasonable page sizes (10-50)
- Include cursor for continuation
- Show total when available
- Let agents request specific pages

### Filtering

Support server-side filtering to reduce transferred data:

```json
{
  "filters": {
    "created_after": "2024-01-01",
    "status": ["open", "in_progress"],
    "limit": 20
  }
}
```

### Content Types

Use appropriate content types:
- `text` for human-readable content
- `image` for visual data (base64 or URL)
- `resource` for references to additional data

## Error Handling

### Protocol vs Tool Errors

**Protocol errors (JSON-RPC):** System-level issues
- Invalid request format
- Unknown method
- Server initialization failure

**Tool errors:** Execution issues
- Set `isError: true` in response
- Include actionable message in content

### Actionable Messages

```json
{
  "isError": true,
  "content": [
    {
      "type": "text",
      "text": "Repository 'myrepo' not found. Available repositories: repo-a, repo-b, repo-c. Use list_repositories for full list."
    }
  ]
}
```

Include:
- What went wrong
- Why it happened (if known)
- What to do instead

### Rate Limiting

Handle gracefully:
```json
{
  "isError": true,
  "content": [
    {
      "type": "text",
      "text": "Rate limit exceeded. Retry after 60 seconds. Consider using batch_search for multiple queries."
    }
  ]
}
```

## Security

### Input Validation

Validate all tool inputs:
- Type checking
- Range validation
- Format verification
- Injection prevention

### Access Controls

- Implement authentication
- Check authorization per tool
- Scope access appropriately
- Fail closed on errors

### Rate Limiting

- Per-client limits
- Per-tool limits
- Burst allowances
- Clear feedback when limited

### Output Sanitization

- Remove sensitive data
- Redact credentials
- Filter internal details
- Audit logged outputs

## Resource Management

### Resource Links

Expose additional context through resources:

```json
{
  "type": "resource",
  "resource": {
    "uri": "file:///docs/api-reference.md",
    "mimeType": "text/markdown"
  }
}
```

Use when:
- Content is large
- Content may not be needed
- Multiple tools reference same content

### Embedded Resources

Embed when content is essential:

```json
{
  "type": "resource",
  "resource": {
    "uri": "inline:///current-config",
    "text": "...",
    "mimeType": "application/json"
  }
}
```

### Annotations

Provide hints about resource usage:

```json
{
  "annotations": {
    "audience": ["developer"],
    "priority": 0.8
  }
}
```

### Change Notifications

Support `notifications/resources/list_changed` when:
- Resources are dynamic
- Agents need to refresh state
- Background changes occur

## Integration Patterns

### Prefer Specific Tools

**Better:** `create_github_issue`, `search_github_issues`, `close_github_issue`

**Worse:** `github_api` with action parameter

Specific tools:
- Have clearer descriptions
- Enable better tool selection
- Simplify error handling

### Match User Intent

Design tools around what users want to accomplish, not just API coverage:

- `summarize_pr` vs raw `get_pr_diff` + `get_pr_comments`
- `find_relevant_code` vs generic `search_files`

### Testing

Test tool descriptions by:
1. Presenting scenarios to agents
2. Checking tool selection accuracy
3. Reviewing reasoning for selection
4. Iterating on descriptions

## Summary

Effective MCP servers:
- Define tools with clear, unambiguous descriptions
- Return minimal, high-signal responses
- Support pagination and filtering
- Provide actionable error messages
- Implement security at every layer
- Use resources for large/optional content
- Design tools around user intent
