# Go live: chigbulaws.com (Worker + R2)

Production uses the **`chigbulaws`** Worker and R2 bucket **`chigbulaw`**, not Cloudflare Pages. Pages steps (`chigbulaws.pages.dev`) are legacy and will not serve `_redirects` or the R2-backed site.

## Prerequisites

1. **`chigbulaws.com` zone** is in the **same** Cloudflare account as `CLOUDFLARE_ACCOUNT_ID` (`bafa242dd95d3fdce72540d20accd0a2` in `wrangler.toml`).  
   If the zone is only on another account, either transfer it or use that account’s API token.
2. API token permissions: **Workers Scripts Edit**, **R2 Object Read/Write**, **Zone DNS Edit** (for automated DNS cleanup).
3. GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

## Fix Error 1000 (about 5 minutes in the dashboard)

This error means DNS points at a **prohibited origin IP** (often a proxied **A** record to Cloudflare anycast `104.x` / `172.x`, or old Squarespace).

### 1. Attach the Worker to the domain

1. **Workers & Pages** → **`chigbulaws`** (not the old Pages project).
2. **Settings** → **Domains & Routes** → **Add** → **Custom Domain**.
3. Add **`chigbulaws.com`** and **`www.chigbulaws.com`**. Wait until status is **Active**.

Or deploy from this repo (creates the same custom domains if the zone is in the account):

```bash
export CLOUDFLARE_API_TOKEN='...'
export CLOUDFLARE_ACCOUNT_ID='bafa242dd95d3fdce72540d20accd0a2'
npm ci
npm run deploy
```

`wrangler.toml` includes `custom_domain = true` for both hostnames.

### 2. Clean up DNS

**DNS** → **Records** for `chigbulaws.com`. **Delete** conflicting records:

- **A** / **AAAA** on `@` or `www` pointing to Cloudflare IPs (`104.x`, `172.x`, etc.) or Squarespace
- **CNAME** `www` → `ext-cust.squarespace.com` (or similar) while proxied
- Duplicate `@` / `www` records from the Squarespace migration
- **CNAME** `@` → `chigbulaws.pages.dev` if you are **not** using Pages (Worker is the host)

After the Worker custom domain is active, Cloudflare manages the correct records. **Do not** paste Cloudflare IP addresses into a manual **A** record.

### 3. Upload site content

```bash
npm run sync:r2   # full site to R2
npm run deploy    # sync + Worker deploy
```

### 4. Verify

- `https://chigbulaws.com/` — homepage (Worker applies `_redirects`)
- `https://www.chigbulaws.com/` — redirect or same site (optional **Redirect Rule**: `www` → apex)
- **SSL/TLS** → **Full (strict)** is fine

### Optional: automated DNS cleanup

When the zone is in your account and the token has **DNS Edit**:

```bash
export CLOUDFLARE_API_TOKEN='...'
export CLOUDFLARE_ACCOUNT_ID='bafa242dd95d3fdce72540d20accd0a2'
./scripts/cloudflare-go-live.sh
```

This removes bad **A** / Squarespace records, runs `npm run deploy`, and relies on Worker custom domains for correct DNS.

## Legacy: Cloudflare Pages (not recommended)

Only use if you intentionally host on Pages instead of the Worker:

1. **Workers & Pages** → project **`chigbulaws`** (Pages) → **Custom domains** → add `chigbulaws.com` / `www`.
2. **CNAME** `@` and `www` → **`chigbulaws.pages.dev`** (proxied).
3. Confirm **Deployments** and `https://chigbulaws.pages.dev`.

`_redirects` and R2 content require the **Worker** path above.
