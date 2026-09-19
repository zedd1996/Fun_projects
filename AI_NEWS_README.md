# AI Intelligence Feed

A lightweight, scrollable AI-news site powered by a single `docs/news.json` feed.

## What is here

- `docs/index.html` — page shell
- `docs/styles.css` — responsive dark UI
- `docs/app.js` — search, filters, ≤12B filter, infinite scroll
- `docs/news.json` — structured news records maintained by the scheduled ChatGPT task

## Publish with GitHub Pages

In this repository, open **Settings → Pages**, choose **Deploy from a branch**, select **main** and the **/docs** folder, then save.

The feed will then be available from the repository's GitHub Pages URL.

## News schema

Each record should look like:

```json
{
  "id": "2026-09-19-example",
  "published_at": "2026-09-19",
  "company": "Example",
  "category": "Open Models",
  "title": "Example model released",
  "summary": "What changed and why it matters.",
  "model_name": "Example-7B",
  "model_type": "Text LLM",
  "input_output": "Text → Text",
  "total_parameters_b": 7,
  "active_parameters_b": null,
  "local": true,
  "hardware": "Approx. 4–8 GB for common quantizations; context adds memory.",
  "best_use_cases": "Coding, extraction, local assistants",
  "worth_testing": "Yes — compare on real tasks",
  "importance": "Worth Testing",
  "confidence": "High",
  "tags": ["Open Models", "≤12B", "Local"],
  "sources": [
    {"name": "Official announcement", "url": "https://example.com"}
  ],
  "discovered_via": "Primary source"
}
```

The scheduled task should preserve old entries, append only genuinely new verified items, and deduplicate by source URL/model/release date.
