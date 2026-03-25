---
name: meme
description: Search and fetch memes (表情包). Use when you need to find or retrieve memes based on Chinese keywords.
metadata: {"gracebot":{"always":false,"emoji":"🖼️","homepage":"https://github.com/your-repo/meme-skill","requires":{"bins":["node","npm"]},"install":[{"id":"node-brew","kind":"brew","formula":"node","bins":["node","npm"],"label":"Install Node.js (brew)"}]},"clawdbot":{"always":false,"emoji":"🖼️","homepage":"https://github.com/your-repo/meme-skill","requires":{"bins":["node","npm"]},"install":[{"id":"node-brew","kind":"brew","formula":"node","bins":["node","npm"],"label":"Install Node.js (brew)"}]}}
---

# Meme Search (fabiaoqing.com)

> **Path Variable**: `{baseDir}` refers to the root directory of this skill, i.e., `{baseDir}`.

Search and fetch memes from fabiaoqing.com through the bundled CLI at `{baseDir}/scripts/meme-cli.js`.

## Scope and Runtime Model

- This skill runs `node {baseDir}/scripts/meme-cli.js ...`.
- The CLI uses `cheerio` for HTML parsing.
- No authentication required (public website).

## Prerequisites

1. Node.js and npm are installed.
2. Install script dependencies once:
   - `cd {baseDir}/scripts && npm install`

## Command Coverage

- Search single page:
  `search <keyword> [page]`
- Search multiple pages:
  `searchAll <keyword> [maxPages]`

## Quick Examples

```bash
node {baseDir}/scripts/meme-cli.js search 鼠鼠 1
node {baseDir}/scripts/meme-cli.js searchAll 鼠鼠 5
```

## Output Format

```json
{
  "keyword": "鼠鼠",
  "page": 1,
  "totalPages": 15,
  "count": 15,
  "memes": [
    {
      "url": "https://img.soutula.com/bmiddle/006D3Lhmgy1halh0zsr1vj30u00u0ae7.jpg",
      "title": "爱鼠你辣~鼠鼠我啊~你鼠你辣鼠鼠我你辣~我啊辣~爱鼠你爱鼠你爱你辣~吸你辣 - 鼠鼠表情包来啦"
    }
  ]
}
```

Each meme object contains:
- `url`: Direct image URL
- `title`: Meme description/title
