# Dynamic Context Adaptation

**Principle:** Adjust context dynamically based on task complexity, model confidence, and user interaction patterns. Not every query needs the same context payload.

## Why

Static context wastes tokens on simple tasks and may be insufficient for complex ones. Dynamic adaptation optimizes the cost/quality tradeoff per request.

## How to Apply

- **Complexity routing**: Classify input complexity, then load proportional context.
- **Confidence-based expansion**: If the model's first response is uncertain, retry with more context.
- **Progressive disclosure**: Start with summary context, expand to details only if needed.
- **User-adaptive**: Adjust based on the user's expertise level and interaction history.

## Example

A coding assistant that adapts context loading:

```python
def get_context(query, user):
    # Always include: task instruction
    context = [SYSTEM_PROMPT]

    # Complexity routing
    complexity = classify_complexity(query)  # simple | medium | complex

    if complexity == "simple":
        # "What does this function do?" — just the function
        context.append(get_function_source(query))

    elif complexity == "medium":
        # "Why does this test fail?" — function + test + related code
        context.append(get_function_source(query))
        context.append(get_test_source(query))
        context.append(get_related_files(query, max=3))

    elif complexity == "complex":
        # "Refactor the auth module" — architecture docs + full module
        context.append(get_architecture_docs())
        context.append(get_module_source(query))
        context.append(get_dependency_graph(query))

    # User adaptation
    if user.is_expert:
        context.append("Be concise. Skip basic explanations.")
    else:
        context.append("Explain your reasoning step by step.")

    return context
```

## Sources

- [Context Engineering 2.0](https://arxiv.org/pdf/2510.26493) — "Adjust context based on model feedback, task complexity, user interaction patterns, and real-time performance metrics"
