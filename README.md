# Chigbu Law Website

Law firm website for Chigbu Law, deployed on Cloudflare Pages.

## Go live today

The site is a plain static HTML/CSS/JS bundle. The repo is wired up to deploy to Cloudflare Pages (project name `chigbulaws`) via GitHub Actions on every push to `master`. To go live, three things need to be true:

1. **GitHub repo secrets exist.** Settings -> Secrets and variables -> Actions:
   - `CLOUDFLARE_API_TOKEN` — token with **Account: Cloudflare Pages — Edit** scoped to the account that owns `chigbulaws.com`, plus **Zone: DNS — Edit** on `chigbulaws.com` if you want the script in `scripts/cloudflare-go-live.sh` to fix DNS for you. Do not set an IP allowlist on the token.
   - `CLOUDFLARE_ACCOUNT_ID` — the account ID from Workers & Pages overview.
2. **A Pages project named `chigbulaws` exists** in that same Cloudflare account (Workers & Pages -> Create -> Pages -> Direct Upload, or the first run of `wrangler pages deploy` will create it).
3. **DNS is correct** for the custom domain (see Error 1000 section below). The site will publish to `https://chigbulaws.pages.dev` regardless of DNS — that is the easiest first checkpoint.

Then push to `master` (or run **Actions -> Deploy to Cloudflare Pages -> Run workflow**). The workflow has a preflight step that fails with a clear error if either secret is missing.

**Common gotchas seen on this repo:** secrets missing entirely; token scoped to a different Cloudflare account than the one that owns `chigbulaws.com`; old `cloudflare/pages-action@v1` (replaced here with `cloudflare/wrangler-action@v3`).

### Step-by-step

1. **Cloudflare account that owns `chigbulaws.com`** -> create an API token with **Pages Edit** + (optional) **DNS Edit** for the `chigbulaws.com` zone. **Do not** set an IP allowlist on the token; GitHub Actions runners use ephemeral IPs.
2. **GitHub** -> repo **Settings -> Secrets and variables -> Actions** -> add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (from Workers & Pages overview).
3. **DNS** (fixes Error 1000): delete **A** records on `@` / `www` pointing at Cloudflare or Squarespace IPs; use **CNAME** `@` and `www` -> `chigbulaws.pages.dev` (**Proxied**). Or run, locally, with the correct token:

   ```bash
   export CLOUDFLARE_API_TOKEN='...'
   export CLOUDFLARE_ACCOUNT_ID='...'
   chmod +x scripts/cloudflare-go-live.sh
   ./scripts/cloudflare-go-live.sh
   ```

4. **Pages** -> project `chigbulaws` -> **Custom domains** -> add `chigbulaws.com` until **Active**.
5. Push to `master` or **Actions -> Deploy to Cloudflare Pages -> Run workflow**.

**Squarespace export:** put files under `squarespace-export/` (or push from GitHub user `sschigbu` when the repo is up).

## Deployment

This site is automatically deployed to Cloudflare Pages when changes are pushed to the `master` branch.

### Setup Instructions

To connect this repository to Cloudflare Pages:

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
