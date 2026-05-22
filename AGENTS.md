# AGENTS.md

## Cursor Cloud specific instructions

This is a static law firm website served by a Cloudflare Worker (`silverback-google`) that reads assets from R2. There is no database, no backend API, and no build step for the frontend (vanilla HTML/CSS/JS).

### Services

| Service | Command | Notes |
|---------|---------|-------|
| Dev server | `npm run dev` | Wrangler dev server on `http://localhost:8787`, simulates Worker + R2 locally |
| Type check | `npm run typecheck` | `tsc --noEmit` on `src/index.ts` |

### Local R2 seeding

`wrangler dev` starts with an empty local R2 bucket. To see actual pages, you must seed it first:

```bash
# Upload all static files to the local R2 bucket (run from repo root)
for f in index.html 404.html style.css forms.css main.js forms.js _redirects about.html contact.html \
  auto-accident.html bankruptcy-law.html business-law.html family-law.html immigration-law.html \
  personal-injury.html sitemap.xml robots.txt og-image.svg; do
  [ -f "$f" ] && npx wrangler r2 object put "chigbulaw/$f" --file "$f" \
    --content-type "$(case "${f##*.}" in html) echo 'text/html; charset=utf-8';; css) echo 'text/css; charset=utf-8';; js) echo 'application/javascript; charset=utf-8';; xml) echo 'application/xml; charset=utf-8';; txt) echo 'text/plain; charset=utf-8';; svg) echo 'image/svg+xml';; *) echo 'application/octet-stream';; esac)" \
    --local
done
# Upload blog posts
for f in blog/*.html; do
  [ -f "$f" ] && npx wrangler r2 object put "chigbulaw/$f" --file "$f" \
    --content-type 'text/html; charset=utf-8' --local
done
```

The seeded data persists in `.wrangler/state/` across restarts of `wrangler dev`.

### Lint / Test

There is no linter or test framework configured. Type checking (`npm run typecheck`) is the only static analysis available.

### Deploy

Deployment requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` environment variables. See `README.md` for details. `npm run deploy` syncs files to remote R2 and deploys the Worker.
