# Chigbu Law Website

Law firm website for **Clifford Chigbu Attorney at Law**, served by the Cloudflare Worker **`silverback-google`** from R2 bucket **`chigbulaw`** (binding `CHIGBULAW`).

## Production architecture

| Piece | Name |
|-------|------|
| Worker | `silverback-google` |
| R2 binding | `CHIGBULAW` → bucket `chigbulaw` |
| Static files | HTML/CSS/JS at repo root → synced to R2 |
| Routes | `*.chigbulaws.com` (configure in Cloudflare dashboard; not overwritten by deploy) |

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

Connect in Cloudflare: **Workers & Pages** → **silverback-google** → **Settings** → **Builds** → link this GitHub repo (or rely on Actions-only deploy).

Redirects from `_redirects` are applied by the Worker (loaded from R2).

### R2 public development URL

Bucket **`chigbulaw`** can expose a Cloudflare-managed **`r2.dev`** URL (non-production preview only):

**https://pub-24d24f9a69cf4abb888e24096291e3a2.r2.dev**

| Check | Expected |
|-------|----------|
| Public access enabled | R2 dashboard → bucket → **Public Development URL** → Allowed |
| Objects uploaded | `npm run sync:r2` (same keys as the Worker: `index.html`, `about.html`, …) |
| Homepage | Open **`/index.html`** — `r2.dev` does not apply `_redirects` or map `/` to `index.html` |
| Production | Use Worker **`silverback-google`** + **`chigbulaws.com`**, not `r2.dev` |

Verify after sync:

```bash
npm run verify:r2-public
# or: R2_PUBLIC_URL=https://pub-....r2.dev npm run verify:r2-public
```

If every path returns **404**, the bucket is empty or sync ran against a different account. Use an API token with **R2 Object Read/Write** on the account that owns `chigbulaw`.

---

## Go live today (Error 1000 + deploy)

**Blockers we found:** GitHub Actions had no `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` secrets; workflow only ran on `main` while this repo uses `master`; `chigbulaws.com` must be in the **same** Cloudflare account as the API token (the Silverback token in this environment only has `mobilecarbsmoketest.com`, not chigbulaws).

1. **Cloudflare account that owns `chigbulaws.com`** → create API token: **Pages Edit** + **DNS Edit** for that zone.
2. **GitHub** → repo **Settings → Secrets** → add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (from Workers & Pages overview).
3. **DNS** (fixes Error 1000): delete **A** records on `@` / `www` pointing at Cloudflare or Squarespace IPs; use **CNAME** `@` and `www` → `chigbulaws.pages.dev` (**Proxied**). Or run (with the correct token):

   ```bash
   export CLOUDFLARE_API_TOKEN='...'
   export CLOUDFLARE_ACCOUNT_ID='...'
   chmod +x scripts/cloudflare-go-live.sh
   ./scripts/cloudflare-go-live.sh
   ```

4. **Pages** → project `chigbulaws` → **Custom domains** → add `chigbulaws.com` until **Active**.
5. Push to `master` or **Actions → Deploy to Cloudflare Pages → Run workflow**.

**Squarespace export:** put files under `squarespace-export/` (or push from GitHub user `sschigbu` when the repo is up).

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

This error means DNS for `chigbulaws.com` points at an IP Cloudflare will not use as an origin—most often a **Cloudflare anycast IP** (from [cloudflare.com/ips](https://www.cloudflare.com/ips/)), an old **Squarespace** host with the orange cloud on, or a **double proxy** (CNAME to another CDN that sends traffic back through Cloudflare).

### Fix (about 5 minutes in the dashboard)

1. **Workers & Pages** → project **chigbulaws** → **Custom domains** → **Set up a domain** → enter `chigbulaws.com` (and `www.chigbulaws.com` if you use www). Wait until status is **Active**. Cloudflare will create the correct DNS records for Pages.

2. **DNS** → **Records** for `chigbulaws.com`. **Delete** any conflicting records:
   - **A** / **AAAA** on `@` or `www` pointing to Cloudflare IPs (`104.x`, `172.x`, etc.) or to old Squarespace IPs
   - **CNAME** `www` → `ext-cust.squarespace.com` (or similar) while proxied
   - Duplicate `@` / `www` records left over from the Squarespace migration

3. **Correct records** (after Pages adds the domain) should look like:
   - **CNAME** `@` → `chigbulaws.pages.dev` — **Proxied** (orange cloud)
   - **CNAME** `www` → `chigbulaws.pages.dev` — **Proxied**, *or* remove `www` and use a **Redirect Rule**: `www.chigbulaws.com` → `https://chigbulaws.com`

   Cloudflare Pages does **not** use a manual **A** record to an IP. Do not paste Cloudflare IP addresses into an A record.

4. Confirm **Deployments** shows a successful production build. Open `https://chigbulaws.pages.dev` — if that works but the custom domain does not, the problem is only DNS.

5. Optional: **SSL/TLS** → **Full (strict)** is fine for Pages.

Reference: [Cloudflare Error 1000](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1000/), [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).
