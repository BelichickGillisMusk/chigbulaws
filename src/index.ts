/**
 * chigbulaws — serve chigbulaws.com static site from R2 (CHIGBULAW → bucket chigbulaw).
 */

export interface Env {
  CHIGBULAW: R2Bucket;
}

type RedirectRule = { from: string; to: string; status: number };

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

let redirectRulesCache: RedirectRule[] | null = null;
let redirectRulesLoading: Promise<RedirectRule[]> | null = null;

function contentType(key: string, object: R2ObjectBody): string {
  return (
    object.httpMetadata?.contentType ??
    MIME[extname(key)] ??
    "application/octet-stream"
  );
}

function extname(key: string): string {
  const i = key.lastIndexOf(".");
  return i >= 0 ? key.slice(i).toLowerCase() : "";
}

function cacheHeaders(key: string): Record<string, string> {
  const ext = extname(key);
  if (ext === ".html") {
    return { "Cache-Control": "public, max-age=300" };
  }
  if ([".css", ".js", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".woff", ".woff2"].includes(ext)) {
    return { "Cache-Control": "public, max-age=86400" };
  }
  return { "Cache-Control": "public, max-age=3600" };
}

function objectHeaders(key: string, object: R2ObjectBody): Headers {
  const h = new Headers();
  h.set("Content-Type", contentType(key, object));
  const cache = cacheHeaders(key);
  for (const [k, v] of Object.entries(cache)) h.set(k, v);
  if (object.httpEtag) h.set("ETag", object.httpEtag);
  return h;
}

function parseRedirects(text: string): RedirectRule[] {
  const rules: RedirectRule[] = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) continue;
    const from = parts[0];
    const status = parseInt(parts[parts.length - 1], 10);
    const to = parts.slice(1, -1).join(" ");
    if (!from.startsWith("/") || Number.isNaN(status)) continue;
    if (from.includes("://")) continue;
    rules.push({ from, to, status });
  }
  return rules;
}

async function loadRedirectRules(env: Env): Promise<RedirectRule[]> {
  if (redirectRulesCache) return redirectRulesCache;
  if (!redirectRulesLoading) {
    redirectRulesLoading = (async () => {
      const obj = await env.CHIGBULAW.get("_redirects");
      if (!obj) return [];
      const text = await obj.text();
      const rules = parseRedirects(text);
      redirectRulesCache = rules;
      return rules;
    })();
  }
  return redirectRulesLoading;
}

function applyRedirect(url: URL, rule: RedirectRule): Response {
  let destPath = rule.to;
  let hash = "";
  const hashIdx = destPath.indexOf("#");
  if (hashIdx >= 0) {
    hash = destPath.slice(hashIdx + 1);
    destPath = destPath.slice(0, hashIdx) || "/";
  }
  const dest = new URL(destPath, url.origin);
  if (hash) dest.hash = hash;
  return new Response(null, {
    status: rule.status,
    headers: { Location: dest.toString() },
  });
}

async function matchRedirect(url: URL, env: Env): Promise<Response | null> {
  const rules = await loadRedirectRules(env);
  const path = url.pathname;

  for (const rule of rules) {
    if (rule.from === "/*") continue;
    if (path === rule.from || path === rule.from.replace(/\/$/, "")) {
      return applyRedirect(url, rule);
    }
  }
  return null;
}

function resolveKeys(pathname: string): string[] {
  let path = decodeURIComponent(pathname);
  if (path.startsWith("/")) path = path.slice(1);
  if (!path) return ["index.html"];

  const keys: string[] = [];
  if (path.endsWith("/")) {
    keys.push(`${path}index.html`);
  } else {
    keys.push(path);
    if (!path.includes(".")) {
      keys.push(`${path}/index.html`);
      keys.push(`${path}.html`);
    }
  }
  return keys;
}

async function getObject(env: Env, keys: string[]): Promise<{ key: string; object: R2ObjectBody } | null> {
  for (const key of keys) {
    const object = await env.CHIGBULAW.get(key);
    if (object) return { key, object };
  }
  return null;
}

async function serve404(url: URL, env: Env): Promise<Response> {
  const rules = await loadRedirectRules(env);
  const catchAll = rules.find((r) => r.from === "/*" && r.status === 404);
  const key = catchAll?.to.replace(/^\//, "") ?? "404.html";
  const object = await env.CHIGBULAW.get(key);
  if (object) {
    return new Response(object.body, {
      status: 404,
      headers: objectHeaders(key, object),
    });
  }
  return new Response("Not Found", { status: 404, headers: { "Content-Type": "text/plain" } });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(request.url);

    if (url.pathname === "/_redirects") {
      return new Response("Not Found", { status: 404 });
    }

    const redirect = await matchRedirect(url, env);
    if (redirect) return redirect;

    const keys = resolveKeys(url.pathname);
    const found = await getObject(env, keys);

    if (!found) {
      return serve404(url, env);
    }

    const { key, object } = found;
    const headers = objectHeaders(key, object);

    if (request.method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }

    return new Response(object.body, { status: 200, headers });
  },
};
