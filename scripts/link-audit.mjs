import fs from 'node:fs/promises';

const origin = (process.env.SITE_URL || 'https://chigbulaws.com').replace(/\/$/, '');
const sitemapUrl = `${origin}/sitemap.xml`;
const timeoutMs = 15000;

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': 'ChigbuLaw-LinkAudit/1.0' },
      signal: controller.signal,
      ...options,
    });
  } finally {
    clearTimeout(timer);
  }
}

function extractLinks(html, baseUrl) {
  const links = new Set();
  const pattern = /href=["']([^"'#]+)["']/gi;
  for (const match of html.matchAll(pattern)) {
    const raw = match[1].trim();
    if (!raw || /^(mailto:|tel:|javascript:|data:)/i.test(raw)) continue;
    try {
      links.add(new URL(raw, baseUrl).href);
    } catch {
      // Ignore malformed URLs here; they are reported separately by page validators.
    }
  }
  return [...links];
}

async function checkUrl(url) {
  try {
    let response = await fetchWithTimeout(url, { method: 'HEAD' });
    if ([403, 405].includes(response.status)) {
      response = await fetchWithTimeout(url, { method: 'GET' });
    }
    return {
      url,
      status: response.status,
      ok: response.status >= 200 && response.status < 400,
      finalUrl: response.url,
    };
  } catch (error) {
    return { url, status: 0, ok: false, error: error.message };
  }
}

const sitemapResponse = await fetchWithTimeout(sitemapUrl);
if (!sitemapResponse.ok) {
  throw new Error(`Could not load sitemap: ${sitemapResponse.status} ${sitemapUrl}`);
}

const sitemap = await sitemapResponse.text();
const pages = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
const pageResults = [];
const discoveredLinks = new Set();

for (const page of pages) {
  const response = await fetchWithTimeout(page);
  const result = { page, status: response.status, ok: response.ok, linksFound: 0 };
  if (response.ok && (response.headers.get('content-type') || '').includes('text/html')) {
    const html = await response.text();
    const links = extractLinks(html, page);
    result.linksFound = links.length;
    links.forEach((link) => discoveredLinks.add(link));
  }
  pageResults.push(result);
}

const linkResults = [];
for (const link of [...discoveredLinks].sort()) {
  linkResults.push(await checkUrl(link));
}

const report = {
  generatedAt: new Date().toISOString(),
  origin,
  sitemapUrl,
  pageCount: pages.length,
  linkCount: linkResults.length,
  brokenPages: pageResults.filter((item) => !item.ok),
  brokenLinks: linkResults.filter((item) => !item.ok),
  redirects: linkResults.filter((item) => item.ok && item.finalUrl && item.finalUrl !== item.url),
  pages: pageResults,
  links: linkResults,
};

await fs.mkdir('reports', { recursive: true });
await fs.writeFile('reports/link-audit.json', `${JSON.stringify(report, null, 2)}\n`);

console.log(`Audited ${report.pageCount} sitemap pages and ${report.linkCount} discovered links.`);
console.log(`Broken pages: ${report.brokenPages.length}; broken links: ${report.brokenLinks.length}; redirects: ${report.redirects.length}.`);

if (report.brokenPages.length || report.brokenLinks.length) {
  process.exitCode = 1;
}
