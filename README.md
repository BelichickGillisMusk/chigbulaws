# 🚀 Quick Start: Deploy to Cloudflare Pages

**Save $50/month** by deploying this static site to Cloudflare Pages (FREE).

## Option 1: Automatic (GitHub Actions) - RECOMMENDED ⭐

### Step 1: Get Your Cloudflare Credentials
1. Login to Cloudflare: https://dash.cloudflare.com (use `bryan@norcalcarbmobile.com`)
2. Get your **Account ID**: Click on "Pages" → look for Account ID on the right
3. Create an **API Token**:
   - Go to My Profile → API Tokens → Create Token
   - Use "Edit Cloudflare Workers" template
   - Copy the token

### Step 2: Add to GitHub
1. Go to: https://github.com/BelichickGillisMusk/chigbulaws/settings/secrets/actions
2. Click "New repository secret" and add:
   - Name: `CLOUDFLARE_API_TOKEN` → Value: (paste your API token)
   - Name: `CLOUDFLARE_ACCOUNT_ID` → Value: (paste your account ID)

### Step 3: Deploy!
- Merge this PR to `main` branch
- Site deploys automatically! ✨

**Your site will be live at**: `https://chigbulaws.pages.dev` (then add custom domain `chigbulaws.com`)

---

## Option 2: Manual Deploy (Quick Test)

```bash
npx wrangler login
npx wrangler pages deploy . --project-name=chigbulaws
```

---

## What's Included?

✅ Free hosting (was $50/month)
✅ All 301 redirects from old Squarespace URLs
✅ Custom 404 page
✅ Sitemap & robots.txt
✅ Automatic HTTPS
✅ Global CDN (fast worldwide)

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.
