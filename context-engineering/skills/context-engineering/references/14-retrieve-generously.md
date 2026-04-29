# Retrieve Generously, Filter Late

**Principle:** Retrieve more context than you think you need, then filter. Top-20 chunks outperform top-5. Don't over-filter prematurely.

## Why

Aggressive early filtering discards potentially relevant information that the model could have used. Models are good at ignoring irrelevant context but cannot recover information that was never provided. Retrieval recall matters more than precision — reranking handles precision.

## How to Apply

- Retrieve broadly (top-20 or more), then apply a reranking layer to surface the best results.
- Combine multiple retrieval strategies (semantic + keyword) before filtering.
- Let the model see more context rather than less — it handles noise better than information gaps.
- Only tighten retrieval if you measure that excess context degrades quality (rare with modern models).

## Example

Over-filtered pipeline:
```
Query → Semantic search → Top-3 chunks → LLM
Result: Misses a critical chunk ranked #7 that contained the answer.
```

Generous retrieval pipeline:
```
Query → Semantic search (top-20)
      → BM25 keyword search (top-20)
      → Merge and deduplicate
      → Reranker scores all candidates
      → Top-10 after reranking → LLM
Result: The critical chunk (originally #7 in semantic, #3 in BM25)
        is now ranked #2 after reranking. Answer is correct.
```

The generous approach trades a small increase in tokens for a significant improvement in answer quality.

## Sources

- [Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval) — "Passing the top-20 chunks to the model is more effective than just the top-10 or top-5"
