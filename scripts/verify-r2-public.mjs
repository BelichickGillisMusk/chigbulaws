#!/usr/bin/env node
/**
 * Check that the R2 public development URL serves synced static files.
 * Usage: node scripts/verify-r2-public.mjs [baseUrl]
 */
const BASE =
  process.argv[2]?.replace(/\/$/, "") ||
  process.env.R2_PUBLIC_URL ||
  "https://pub-24d24f9a69cf4abb888e24096291e3a2.r2.dev";

const PATHS = [
  { path: "/index.html", label: "homepage object" },
  { path: "/style.css", label: "main stylesheet" },
  { path: "/about.html", label: "about page" },
];

async function check(path) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return { url, status: res.status, ok: res.ok };
  } catch (err) {
    return { url, status: 0, ok: false, error: String(err) };
  }
}

console.log(`R2 public URL: ${BASE}\n`);

let failed = 0;
for (const { path, label } of PATHS) {
  const result = await check(path);
  const mark = result.ok ? "OK" : "MISSING";
  if (!result.ok) failed++;
  const extra = result.error ? ` (${result.error})` : "";
  console.log(`[${mark}] ${label}: ${result.status} ${result.url}${extra}`);
}

const root = await check("/");
console.log(
  `\nNote: r2.dev often returns 404 for "/" even when index.html exists; use /index.html or the Worker for the site root.`,
);
console.log(`Root "/" HEAD: ${root.status}`);

if (failed > 0) {
  console.log(
    "\nFix: run npm run sync:r2 with CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID for the account that owns bucket chigbulaw.",
  );
  process.exit(1);
}

console.log("\nAll checked objects are reachable.");
