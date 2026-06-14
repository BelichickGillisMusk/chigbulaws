# Go live: chigbulaws.com on Cloudflare

## Current status (checked 2026-05-22)

| Check | Result |
|-------|--------|
| `chigbulaws.com` DNS | Proxied through Cloudflare (`A` → `104.x` / `172.x`) |
| `chigbulaws.pages.dev` | HTTP **500** (Pages project broken or empty) |
| GitHub Actions `deploy-worker.yml` | **Failing** — no `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` in repo secrets |
| Cursor secret `cloudflare token` | Valid, but **wrong account** (only `mobilecarbsmoketest.com`; no `chigbulaws.com` zone, no Workers/R2) |

**The new site files in this repo are ready.** Deployment is blocked only by credentials and DNS in the Cloudflare account that owns **chigbulaws.com**.

## One-time fix (about 10 minutes)

### 1. API token (correct account)

Log in to the Cloudflare account where **chigbulaws.com** appears under **Websites**.

Create an API token with:

- **Account** → Workers Scripts → **Edit**
- **Account** → Workers R2 Storage → **Edit**
- **Zone** → `chigbulaws.com` → **DNS** → **Edit** (optional, for DNS script)

Copy **Account ID** from **Workers & Pages** → Overview (right sidebar).

### 2. GitHub secrets

https://github.com/BelichickGillisMusk/chigbulaws/settings/secrets/actions

| Secret | Value |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | Token from step 1 |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID from step 1 |

### 3. Deploy

**Actions** → **Deploy silverback-google Worker** → **Run workflow**

Or locally:

```bash
export CLOUDFLARE_API_TOKEN='...'
export CLOUDFLARE_ACCOUNT_ID='...'
npm ci
bash scripts/deploy-production.sh
```

### 4. DNS (if the site still errors)

In **DNS** for `chigbulaws.com`, remove **A** records on `@` / `www` that point at Cloudflare IPs or Squarespace.

**Worker route** (recommended, already used in production):

- **Workers & Pages** → **silverback-google** → **Triggers** → route `*chigbulaws.com/*`

**Or Pages fallback:**

```bash
FIX_DNS=1 bash scripts/cloudflare-go-live.sh
```

(CNAME `@` and `www` → `chigbulaws.pages.dev`, proxied.)

## Which design goes live?

This repo deploys the **new static site** (`index.html`, service pages, `blog/`). The Squarespace XML export is archived and not uploaded.

## Verify

- https://chigbulaws.com/
- https://chigbulaws.com/about.html
- https://chigbulaws.com/contact.html
