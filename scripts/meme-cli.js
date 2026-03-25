#!/usr/bin/env node
/**
 * Meme CLI - Fetch memes (表情包) from fabiaoqing.com
 * Uses cheerio for HTML parsing
 */

const https = require('https');
const { load } = require('cheerio');

const BASE_URL = 'https://fabiaoqing.com';

// Fetch HTML content from URL
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }, (err) => reject(err)).on('error', reject);
  });
}

// Parse meme page and extract images
function parseMemePage(html) {
  const $ = load(html);
  const memes = [];

  $('.searchbqppdiv.tagbqppdiv').each((i, el) => {
    const $el = $(el);
    const img = $el.find('img.bqppsearch.lazy');
    const a = $el.find('a');

    const imageUrl = img.attr('data-original');
    const title = a.attr('title') || '';

    if (imageUrl) {
      memes.push({
        url: imageUrl,
        title: title
      });
    }
  });

  return memes;
}

// Get total pages from pagination
function parseTotalPages(html) {
  const $ = load(html);
  const pagination = $('.ui.pagination.menu a.item');
  let maxPage = 1;

  pagination.each((i, el) => {
    const text = $(el).text().trim();
    const pageNum = parseInt(text, 10);
    if (!isNaN(pageNum) && pageNum > maxPage) {
      maxPage = pageNum;
    }
  });

  return maxPage;
}

const commands = {
  // Search memes by keyword
  async search(keyword, page = 1) {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `${BASE_URL}/search/bqb/keyword/${encodedKeyword}/type/bq/page/${page}.html`;

    const html = await fetchUrl(url);
    const memes = parseMemePage(html);
    const totalPages = parseTotalPages(html);

    return {
      keyword,
      page,
      totalPages,
      count: memes.length,
      memes
    };
  },

  // Search memes with multiple pages
  async searchAll(keyword, maxPages = 3) {
    const encodedKeyword = encodeURIComponent(keyword);
    const allMemes = [];

    // First page to get total pages
    const firstUrl = `${BASE_URL}/search/bqb/keyword/${encodedKeyword}/type/bq/page/1.html`;
    const firstHtml = await fetchUrl(firstUrl);
    const totalPages = parseTotalPages(firstHtml);
    const pagesToFetch = Math.min(maxPages, totalPages);

    // Fetch first page
    const firstMemes = parseMemePage(firstHtml);
    allMemes.push(...firstMemes);

    // Fetch remaining pages
    for (let page = 2; page <= pagesToFetch; page++) {
      const url = `${BASE_URL}/search/bqb/keyword/${encodedKeyword}/type/bq/page/${page}.html`;
      const html = await fetchUrl(url);
      const memes = parseMemePage(html);
      allMemes.push(...memes);
    }

    return {
      keyword,
      totalPages,
      pagesFetched: pagesToFetch,
      count: allMemes.length,
      memes: allMemes
    };
  }
};

// CLI execution
async function main() {
  const [,, command, ...args] = process.argv;

  if (!command || !commands[command]) {
    console.error('Usage: meme-cli.js <command> [args...]');
    console.error('\nAvailable commands:');
    console.error('  search <keyword> [page]  - Search memes by keyword (default page 1)');
    console.error('  searchAll <keyword> [maxPages] - Search memes across multiple pages (default 3)');
    console.error('\nExamples:');
    console.error('  node meme-cli.js search 鼠鼠 1');
    console.error('  node meme-cli.js searchAll 鼠鼠 5');
    process.exit(1);
  }

  try {
    let result;
    if (command === 'search') {
      const [keyword, page] = args;
      result = await commands.search(keyword, page ? parseInt(page, 10) : 1);
    } else if (command === 'searchAll') {
      const [keyword, maxPages] = args;
      result = await commands.searchAll(keyword, maxPages ? parseInt(maxPages, 10) : 3);
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = commands;
