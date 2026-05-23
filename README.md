# Chigbu Law Website

Law firm website for **Clifford Chigbu Attorney at Law**, served by the Cloudflare Worker **`chigbulaws`** from R2 bucket **`chigbulaw`** (binding `CHIGBULAW`).

## Production architecture

| Piece | Name |
|-------|------|
| Worker | `chigbulaws` |
| Account ID | `bafa242dd95d3fdce72540d20accd0a2` |
| R2 bucket | `chigbulaw` ([R2 catalog](https://catalog.cloudflarestorage.com/bafa242dd95d3fdce72540d20accd0a2/chigbulaw)) |
| R2 binding | `CHIGBULAW` → bucket `chigbulaw` |
| Static files | HTML/CSS/JS at repo root → synced to R2 |
| Custom domains | `chigbulaws.com`, `www.chigbulaws.com` (in `wrangler.toml`; zone must be in account) |

### Which site content is uploaded?

**The new static site** built in this repo (`index.html`, service pages, `blog/`, etc.) — **not** the old Squarespace XML in `squarespace-export/` (that file is empty and is skipped on upload).

### Deploy (zero-downtime order)

1. **`npm run sync:r2`** — uploads the full new site to R2 (live Worker keeps serving until each key is replaced).
2. **`npm run sync:r2:minimal`** — homepage only: `index.html` + CSS/JS + `404.html` (use if you want something live fast; other nav links 404 until full sync).
3. **`npm run deploy`** — sync + `wrangler deploy` (updates Worker script only).

```bash
export CLOUDFLARE_API_TOKEN='...'
export CLOUDFLARE_ACCOUNT_ID='...'
npm ci
npm run deploy
```

### GitHub CI/CD

Workflow: **`.github/workflows/deploy-worker.yml`** on push to `master`.

Secrets required: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (token needs **Workers Scripts Edit** + **R2 Object Read/Write**).

Connect in Cloudflare: **Workers & Pages** → **chigbulaws** → **Settings** → **Builds** → link this GitHub repo (or rely on Actions-only deploy).

Redirects from `_redirects` are applied by the Worker (loaded from R2).

---

## Go live today (Error 1000 + deploy)

Full checklist: **[GO-LIVE.md](GO-LIVE.md)**.

**Production host:** Worker **`chigbulaws`** + R2 **`chigbulaw`** — not Cloudflare Pages. Do **not** point DNS at `chigbulaws.pages.dev` unless you intentionally use the legacy Pages project.

1. **`chigbulaws.com` zone** must be in the **same** Cloudflare account as `CLOUDFLARE_ACCOUNT_ID` (see `wrangler.toml`). Add the zone at [dash.cloudflare.com](https://dash.cloudflare.com) if it is missing.
2. **API token:** **Workers Scripts Edit**, **R2 Object Read/Write**, **Zone DNS Edit**.
3. **GitHub** → **Settings → Secrets** → `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
4. **Deploy** (sync R2 + Worker + custom domains):

   ```bash
   export CLOUDFLARE_API_TOKEN='...'
   export CLOUDFLARE_ACCOUNT_ID='bafa242dd95d3fdce72540d20accd0a2'
   npm ci && npm run deploy
   ```

   Or DNS cleanup + deploy: `./scripts/cloudflare-go-live.sh`

5. Push to **`master`** → **Actions → Deploy chigbulaws Worker**.

**Squarespace export:** put files under `squarespace-export/` (reference only; not deployed).

## Deployment (legacy Pages)

Cloudflare **Pages** is no longer the primary host. Use the Worker workflow above. The old Pages workflow is manual-only (`deploy-cloudflare.yml`).

### Setup Instructions (GitHub Actions)

1. **Get your Cloudflare credentials:**
   - Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Get your Account ID from the Workers & Pages overview
   - Create an API Token with "Cloudflare Pages - Edit" permissions

2. **Add GitHub Secrets:**
   - Go to your GitHub repository Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

3. **Manual Deployment (Alternative):**
   ```bash
   # Install Wrangler CLI
   npm install -g wrangler

   # Login to Cloudflare
   wrangler login

   # Deploy
   wrangler pages deploy . --project-name=chigbulaws
   ```

### Local Development

This is a static HTML/CSS/JavaScript website. Simply open `index.html` in a browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

## Project Structure

- `index.html` - Homepage
- `about.html` - About page
- `contact.html` - Contact page
- Service pages:
  - `auto-accident.html`
  - `bankruptcy-law.html`
  - `business-law.html`
  - `family-law.html`
  - `immigration-law.html`
  - `personal-injury.html`
- `blog/` - Blog posts
- `style.css` - Main stylesheet
- `forms.css` - Form styles
- `forms.js` - Bilingual intake form logic
- `main.js` - Main JavaScript
- `_redirects` - Cloudflare Pages redirects (301s from old Squarespace URLs)
- `sitemap.xml` - SEO sitemap
- `robots.txt` - Search engine crawler instructions

## Features

- Multi-step bilingual intake forms (English/Spanish)
- Service area pages for all practice areas
- Blog with legal insights
- SEO optimized with schema.org markup
- Responsive design
- Facebook integration
- FAQ schema for rich snippets

## Troubleshooting: Error 1000 (DNS points to prohibited IP)

DNS for `chigbulaws.com` points at an IP Cloudflare will not use as an origin—often a proxied **A** record to Cloudflare anycast (`104.x`, `172.x`), old **Squarespace** IPs, or a **double proxy**.

### Fix (about 5 minutes in the dashboard)

Use the **Worker** `chigbulaws`, not the Pages project.

1. **Workers & Pages** → **`chigbulaws`** (Worker) → **Settings** → **Domains & Routes** → **Add Custom Domain** → `chigbulaws.com` and `www.chigbulaws.com`. Wait until **Active** (or run `npm run deploy` from this repo).

2. **DNS** → **Records** for `chigbulaws.com`. **Delete** conflicting records:
   - **A** / **AAAA** on `@` or `www` pointing to Cloudflare IPs (`104.x`, `172.x`, etc.) or Squarespace
   - **CNAME** `www` → `ext-cust.squarespace.com` (or similar) while proxied
   - **CNAME** `@` → `chigbulaws.pages.dev` if you are on the Worker (not Pages)
   - Duplicate `@` / `www` records from the Squarespace migration

3. **Do not** create a manual **A** record to a Cloudflare IP. Let **Custom Domain** on the Worker create the correct DNS.

4. **R2 + deploy:** `npm run sync:r2` then `npm run deploy`. Open `https://chigbulaws.com/`.

5. Optional: **SSL/TLS** → **Full (strict)**; **Redirect Rule** `www.chigbulaws.com` → `https://chigbulaws.com`.

**Legacy Pages only:** CNAME `@` / `www` → `chigbulaws.pages.dev` and add custom domains on the **Pages** project — see [GO-LIVE.md](GO-LIVE.md).

Reference: [Error 1000](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1000/), [Worker custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).
