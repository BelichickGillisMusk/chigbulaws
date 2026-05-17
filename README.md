# Chigbu Law Website

Law firm website for Chigbu Law, deployed on Cloudflare Pages.

## Deployment

This site is automatically deployed to Cloudflare Pages on every push to `master` (and `main`, if used).
Pull requests publish to a unique preview URL via the same workflow.

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
- `favicon.svg`, `logo.svg`, `og-image.svg` - Brand assets used by browsers, Google Knowledge Panel, and social previews

## Google Search Console verification

`index.html` includes a commented-out `google-site-verification` meta tag. After you
register the property in Search Console, copy the token from the HTML-tag verification
method and paste it into the `content=""` value, then re-deploy.

## Google Business Profile

The site is configured to support the GBP listing:
- LocalBusiness / LegalService JSON-LD with NAP, hours, geo, and `sameAs` to the State Bar listing.
- `logo.svg` is referenced for the Knowledge Panel.
- `_redirects` preserves all 301s from the old Squarespace URLs that the GBP listing or backlinks may still point to.

Keep the NAP **exactly** consistent everywhere (`4815 Laguna Park Drive, Elk Grove, CA 95758` / `916-230-6381`):
- The GBP listing
- `index.html` JSON-LD
- `about.html` and `contact.html`
- The site footer

## Features

- Multi-step bilingual intake forms (English/Spanish)
- Service area pages for all practice areas
- Blog with legal insights
- SEO optimized with schema.org markup
- Responsive design
- Facebook integration
- FAQ schema for rich snippets
