interface:
  display_name: "Meme"
  short_description: "Search and fetch memes (表情包) from fabiaoqing.com"
  default_prompt: "Use the Meme skill to search for and fetch memes from fabiaoqing.com based on keywords."

# Meme Skill

Search and fetch memes (表情包) from fabiaoqing.com using the bundled Node CLI (`scripts/meme-cli.js`).

## Security/Runtime Summary

- Runtime: local Node.js script in this repo
- Dependency: `cheerio` (installed under `scripts/`)
- Credential: none required (public website)
- API scope: HTML scraping from fabiaoqing.com

## Install

```bash
cd meme-skill/scripts
npm install
```

## Usage

```bash
# Search memes by keyword on a specific page
node meme-cli.js search 鼠鼠 1

# Search memes across multiple pages
node meme-cli.js searchAll 鼠鼠 5
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
