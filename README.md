# Chigbu Law Website

Law firm website for Chigbu Law, deployed on Cloudflare Pages.

## Go Live Checklist

1. **Create a Cloudflare API token** in the account that owns `chigbulaws.com` — needs **Cloudflare Pages: Edit** + **DNS: Edit** permissions for that zone.
2. **Add GitHub Secrets** — repo **Settings → Secrets and variables → Actions**:
   - `CLOUDFLARE_API_TOKEN` — the token from step 1
   - `CLOUDFLARE_ACCOUNT_ID` — from the Cloudflare dashboard **Workers & Pages** overview
3. **DNS** (fixes Error 1000): in Cloudflare DNS, delete any **A** records on `@` / `www` pointing at Cloudflare or Squarespace IPs. Use **CNAME** `@` and `www` → `chigbulaws.pages.dev` (**Proxied**). Or run the go-live script:

   ```bash
   export CLOUDFLARE_API_TOKEN='...'
   export CLOUDFLARE_ACCOUNT_ID='...'
   chmod +x scripts/cloudflare-go-live.sh
   ./scripts/cloudflare-go-live.sh
   ```

4. **Custom domain** — in Cloudflare dashboard: **Workers & Pages** → project `chigbulaws` → **Custom domains** → add `chigbulaws.com` and wait until **Active**.
5. **Deploy** — push to `master` or `main`, or go to **Actions → Deploy to Cloudflare Pages → Run workflow**.

**Squarespace export:** put files under `squarespace-export/` (or push from GitHub user `sschigbu` when the repo is up).

## Deployment

This site is automatically deployed to Cloudflare Pages when changes are pushed to the `master` branch.

### Manual Deployment

```bash
npm install -g wrangler
wrangler login
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
