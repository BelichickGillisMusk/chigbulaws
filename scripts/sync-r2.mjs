#!/usr/bin/env node
/**
 * Upload static site files to R2 bucket chigbulaw (no Worker deploy).
 * Run before wrangler deploy so existing traffic keeps serving during transition.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BUCKET = process.env.R2_BUCKET_NAME || "chigbulaw";

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".github",
  ".wrangler",
  "src",
  "scripts",
  "squarespace-export",
  "vendor",
]);

const SKIP_FILES = new Set([
  "wrangler.toml",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  ".gitignore",
  "README.md",
]);

const MIME = {
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
};

function walk(dir, base = "") {
  const entries = [];
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      entries.push(...walk(full, rel));
    } else if (stat.isFile()) {
      if (!SKIP_FILES.has(name)) entries.push(rel);
    }
  }
  return entries;
}

function wranglerBin() {
  return path.join(ROOT, "node_modules", ".bin", "wrangler");
}

function put(key, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";
  const bin = fs.existsSync(wranglerBin()) ? wranglerBin() : "npx";
  const args =
    bin === "npx"
      ? [
          "wrangler",
          "r2",
          "object",
          "put",
          `${BUCKET}/${key}`,
          "--file",
          filePath,
          "--content-type",
          contentType,
          "--remote",
        ]
      : [
          "r2",
          "object",
          "put",
          `${BUCKET}/${key}`,
          "--file",
          filePath,
          "--content-type",
          contentType,
          "--remote",
        ];

  execFileSync(bin, args, { cwd: ROOT, stdio: "inherit", env: process.env });
}

const MINIMAL_FILES = [
  "index.html",
  "404.html",
  "_redirects",
  "style.css",
  "forms.css",
  "main.js",
  "forms.js",
  "og-image.svg",
];

const minimal = process.argv.includes("--minimal") || process.env.SYNC_MINIMAL === "1";
const files = minimal ? MINIMAL_FILES.filter((f) => fs.existsSync(path.join(ROOT, f))) : walk(ROOT);

if (minimal) {
  console.log(`Minimal upload (homepage + assets only, ${files.length} files)`);
}
console.log(`Uploading ${files.length} objects to r2://${BUCKET}/ ...`);

for (const rel of files.sort()) {
  const key = rel.replace(/\\/g, "/");
  put(key, path.join(ROOT, rel));
}

if (minimal) {
  console.log("Note: Service/blog links on the homepage will 404 until you run a full sync (npm run sync:r2).");
}

console.log("R2 sync complete.");
