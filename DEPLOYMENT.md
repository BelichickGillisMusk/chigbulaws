# Cloudflare deployment guide

**Production:** Worker **`chigbulaws`** + R2 **`chigbulaw`**. See **[GO-LIVE.md](GO-LIVE.md)** for DNS and Error 1000.

The sections below describe **legacy Cloudflare Pages** only.

## Automatic Deployment (Recommended)

### Setup GitHub Actions (One-time)

1. **Get Cloudflare API Token**:
   - Log in to Cloudflare Dashboard with `bryan@norcalcarbmobile.com`
   - Go to **My Profile** → **API Tokens**
   - Click **Create Token**
   - Use the **"Edit Cloudflare Workers"** template or create a custom token with:
     - Permissions: `Account.Cloudflare Pages — Edit`
   - Copy the API token

2. **Get Cloudflare Account ID**:
   - In Cloudflare Dashboard, go to **Pages**
   - Your Account ID is shown on the right sidebar
   - Or go to any domain → Overview (bottom right)

3. **Add Secrets to GitHub**:
   - Go to this repository on GitHub
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Add two secrets:
     - `CLOUDFLARE_API_TOKEN` → paste your API token
     - `CLOUDFLARE_ACCOUNT_ID` → paste your account ID

4. **Trigger Deployment**:
   - Push to the `main` branch, or
   - Go to **Actions** tab → **Deploy to Cloudflare Pages** → **Run workflow**

The site will automatically deploy on every push to `main`.

## Manual Deployment

If you prefer to deploy manually or want to test locally:

### Prerequisites
- Node.js installed (version 16+)

### Deploy Command

```bash
# Install wrangler globally (optional)
npm install -g wrangler

# Login to Cloudflare
npx wrangler login

# Deploy the site
npx wrangler pages deploy . --project-name=chigbulaws
```

Or use the shorthand:
```bash
npx wrangler pages deploy
```

## Custom Domain Setup

After the first deployment:

1. Go to Cloudflare Dashboard → **Pages** → **chigbulaws**
2. Navigate to **Custom domains**
3. Click **Set up a custom domain**
4. Enter `chigbulaws.com`
5. Cloudflare will automatically configure DNS if the domain is in the same account

The site will be available at:
- Production: `https://chigbulaws.com`
- Preview: `https://chigbulaws.pages.dev`

## Features Included

✅ **Static HTML/CSS/JS** hosting (all files in root directory)
✅ **URL Redirects** via `_redirects` file (301 redirects from old Squarespace URLs)
✅ **Custom 404 page** (`404.html`)
✅ **Sitemap** (`sitemap.xml`)
✅ **Robots.txt**
✅ **Free hosting** on Cloudflare Pages (no $50/month cost)
✅ **Automatic HTTPS**
✅ **Global CDN** (fast worldwide)
✅ **Unlimited bandwidth** (on Free plan)

## Cost Comparison

| Feature | Previous Host | Cloudflare Pages |
|---------|--------------|------------------|
| Monthly Cost | **$50** | **$0** (Free) |
| Bandwidth | Limited | Unlimited |
| SSL/HTTPS | ✅ | ✅ |
| Custom Domain | ✅ | ✅ |
| CDN | Maybe | ✅ Global |
| Build Minutes | N/A | 500/month (Free) |

## Troubleshooting

### Deployment fails
- Check that `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set correctly in GitHub Secrets
- Verify the API token has the correct permissions

### Site not loading
- Check Cloudflare Dashboard → Pages → chigbulaws for deployment status
- Ensure custom domain is properly configured

### Redirects not working
- Cloudflare Pages automatically processes `_redirects` file
- Check the file format matches Cloudflare's specification

## Support

For issues with:
- **Deployment**: Check GitHub Actions logs
- **Cloudflare**: Contact Cloudflare support or check [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)
- **Site content**: Edit HTML files and push to `main` branch
