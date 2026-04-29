# Contextualize Retrieved Chunks

**Principle:** Prepend chunk-specific explanatory context before embedding or indexing. Don't retrieve naked text fragments.

## Why

Traditional RAG chunking destroys context. A chunk saying "revenue increased 3%" is meaningless without knowing *which company*, *which quarter*, and *compared to what*. Contextual retrieval reduced failure rates by 35% with embeddings alone, and 67% when combined with BM25 and reranking.

## How to Apply

1. For each chunk, use an LLM to generate a short (50-100 token) contextual prefix.
2. Prepend this prefix to the chunk before embedding.
3. Apply the same contextualization to BM25 indexing.
4. Add a reranking layer for further filtering.
5. Use prompt caching to keep costs low (~$1.02 per million document tokens).

## Example

Raw chunk (after naive splitting):
```
The gross margin was 62%, up from 58% in the prior period.
Operating expenses included $42M in R&D and $28M in S&M.
```

Contextualized chunk:
```
[This chunk is from Acme Corp's Q3 2024 10-K filing, specifically
the Management Discussion & Analysis section discussing financial
performance compared to Q3 2023.]

The gross margin was 62%, up from 58% in the prior period.
Operating expenses included $42M in R&D and $28M in S&M.
```

The contextualized version enables the retrieval system to match queries like "Acme Corp profitability trends" or "Q3 2024 R&D spending" — queries the raw chunk would miss.

## Sources

- [Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval) — Full methodology with benchmark results showing 35-67% reduction in retrieval failures
