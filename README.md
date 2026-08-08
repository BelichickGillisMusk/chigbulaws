# CLIFFORD CHIGBU ATTORNEY AT LAW — WEBSITE

## README FOR LLMs AND HUMANS

> **⚠️ CRITICAL RULE FOR LLMs:** Only use the files and structure in this repository for edits and blog posts. Do NOT create new frameworks, redesign the layout, change the tech stack, or add new dependencies. To make changes: edit the existing `.astro` files, add `.md` files to `src/content/blog/`, or edit `public/_redirects`. That's it. The design, layout, styling, and architecture are final — do not modify them unless explicitly asked to by the user.

---

## BUSINESS INFO (use in all content)

- **Name:** Clifford Chigbu, Attorney at Law
- **Phone:** 916-230-6381 (use `tel:9162306381`)
- **Email:** chigbulaw@sbcglobal.net (use `mailto:chigbulaw@sbcglobal.net`)
- **Contact form sends to:** chigbulaw@sbcglobal.net (primary) + fsu9913@gmail.com (backup)
- **Address:** 4815 Laguna Park Dr, Suite C, Elk Grove, CA 95758
- **Website:** https://chigbulaws.com
- **Google Business Profile:** https://share.google/SVzBMps2zWv25qirL
- **Facebook:** https://www.facebook.com/chigbulaw
- **Site design credit:** MLB Marketing LLC (https://mlbmarketingllc.com)

## BRANDING

- **Colors:** Navy deep `#1a2744`, Gold `#c9a227`, Gold light `#e0b84a`
- **Fonts:** Playfair Display (headings/serif), Inter (body/sans)
- **Logo:** Scales of justice SVG (in `public/favicon.svg`)
- **OG image:** `public/og-image.svg`

---

## HOW TO ADD A BLOG POST

### For humans (via GitHub web editor)

1. Go to GitHub → this repo → `src/content/blog/`
2. Click "Add file" → "Create new file"
3. Name it: `my-new-post-slug.md` (use kebab-case, no spaces)
4. Paste this template at the top:

```markdown
---
title: "Your Post Title Here"
description: "A one-sentence summary for SEO and the blog listing."
pubDate: 2026-08-08
author: "Clifford Chigbu"
tags: ["family-law", "elk-grove"]
draft: false
---

Write your post content here in plain text or Markdown.
```

5. Write the post content below the `---` line
6. Click "Commit changes"
7. If Workers Builds is connected, it auto-deploys. Otherwise run `npm run deploy`.

**Do not deploy without Bryan's explicit permission.**

### For LLMs (when asked to write or edit a blog post)

You may ONLY do these things:

- ✅ Create a new `.md` file in `src/content/blog/`
- ✅ Edit an existing `.md` file in `src/content/blog/`
- ✅ Edit text content in existing `.astro` page files
- ✅ Add entries to `public/_redirects`

You may NOT do these things:

- ❌ Create new `.astro` files or pages
- ❌ Modify `BaseLayout.astro`, `PracticeLayout.astro`, or any layout file
- ❌ Change `wrangler.jsonc`, `astro.config.mjs`, or `package.json`
- ❌ Add new npm dependencies
- ❌ Change the design, colors, fonts, or styling
- ❌ Create a new framework or restructure the project

### Blog post creation steps for LLMs

1. Create a file at `src/content/blog/[slug].md`
2. Use the frontmatter template above
3. Set `pubDate` to the current date (`YYYY-MM-DD` format)
4. Choose tags from this list (use 1–3 tags):
   - `firm-recognition` → "Firm Recognition"
   - `law-updates` → "Law Updates"
   - `family-law` → "Family Law"
   - `immigration` → "Immigration"
   - `business-law` → "Business Law"
   - `auto-accident` → "Auto Accident"
   - `personal-injury` → "Personal Injury"
   - `divorce` → "Family Law"
   - `legislation` → "Law Updates"
   - `california` → "Law Updates"
   - `sacramento` → "Local Resources"
   - `elk-grove` → "Local Resources"
   - `personal-story` → "Immigration"
   - `compliance` → "Business Law"
   - `basics` → "Family Law"
   - `firm-news` → "Firm News"
5. Set `draft: false` to publish, `draft: true` to hide
6. Write the body in Markdown (supports headings, lists, bold, links, images, blockquotes)
7. The post URL will be `chigbulaws.com/blog/[slug]` (no `.html`)

### Blog post rules

- **Tone:** Professional but accessible. Clifford is an attorney speaking to potential clients.
- **Voice:** First person when Clifford is sharing personal experience; third person for informational posts.
- **Length:** 500–1500 words is typical. Longer is fine for comprehensive guides.
- **Always include:** A call-to-action at the end pointing to `/contact` or `tel:9162306381`
- **Never include:** Specific legal advice for individual cases. Use general information only.
- **Disclaimer:** The site has a global disclaimer in the footer. Posts don't need individual disclaimers.

---

## SHARING BLOG POSTS TO SOCIAL MEDIA

Yes — blog posts can and should be shared to Google Business Profile, Facebook, and X.com.

### Google Business Profile

1. Go to https://business.google.com and log in with the account managing Clifford's profile
2. Click "Add update" or "Create post"
3. Copy the blog post title and first paragraph
4. Add the blog URL: `https://chigbulaws.com/blog/[slug]`
5. Upload an image if available (or use the OG image at https://chigbulaws.com/og-image.svg)
6. Add a "Learn more" button linking to the blog post URL
7. Publish

### Facebook

1. Go to the firm's Facebook page
2. Create a new post
3. Paste the blog URL: `https://chigbulaws.com/blog/[slug]`
4. Facebook will auto-generate a preview card with the title, description, and OG image
5. Add a brief intro line above the link (e.g., "New blog post: What to do after a car accident in Elk Grove →")
6. Publish

### X.com (Twitter)

1. Go to https://x.com and log in to the firm's account
2. Create a new post
3. Write a brief hook (1–2 sentences) + the blog URL: `https://chigbulaws.com/blog/[slug]`
4. X will auto-generate a preview card with the title, description, and OG image
5. Publish

### Sharing checklist for each new post

- [ ] Blog post published and live on chigbulaws.com
- [ ] Share to Google Business Profile with image + "Learn more" button
- [ ] Share to Facebook page with intro text + link
- [ ] Share to X.com with hook text + link
- [ ] Verify the OG image preview appears correctly on each platform

---

## EXISTING BLOG POSTS (10 total)

| File | Title | Date | Tags |
|------|-------|------|------|
| `best-family-law-attorney-elk-grove-2026.md` | Two Years in a Row: Clifford Chigbu Recognized as a Best Family Law Attorney in Elk Grove | 2026-07-21 | firm-recognition, family-law, elk-grove |
| `2026-new-laws.md` | 2026: New State and Federal Laws You Need to Know | 2026-03-28 | law-updates, legislation, california |
| `welcome-to-chigbu-law.md` | A New Chapter for Chigbu Law | 2026-01-15 | firm-news, elk-grove |
| `gratitude-top-family-attorney.md` | A Moment of Gratitude: Clifford Chigbu Recognized as a Top Family Law Attorney | 2025-12-17 | family-law, firm-recognition, elk-grove |
| `divorce-sacramento.md` | Navigating Divorce in Sacramento: Local Laws and Resources | 2025-10-18 | family-law, divorce, sacramento |
| `immigrant-immigration-law.md` | From One Immigrant to Another: Navigating Immigration Law | 2025-09-06 | immigration, personal-story |
| `business-legal-requirements-sacramento.md` | Business Legal Requirements in Sacramento County | 2025-08-28 | business-law, sacramento, compliance |
| `california-family-law-basics.md` | California Family Law Basics Every Resident Should Know | 2025-08-28 | family-law, california, basics |
| `car-accident-elk-grove.md` | What to Do After a Car Accident in Elk Grove | 2025-08-26 | auto-accident, elk-grove, personal-injury |
| `immigration-changes-2025.md` | Immigration Changes in 2025 — What You Need to Know | 2025-08-26 | immigration, law-updates, 2025 |

### ⚠️ TODO: FILL IN BLOG CONTENT

9 of the 10 blog posts currently contain only the title, description, and a `<!-- TODO -->` comment. The full original content from the WordPress/HTML version needs to be pasted in.

**Source of original content:**

- GitHub repo: `BelichickGillisMusk/chigbulaws` branch `cursor/schema-patch-181f` in the `blog/` folder
- Or the original WordPress export (Google Drive)
- Or the live site at `chigbulaws.com/blog/[slug].html`

**To fill in a post:** Open the `.md` file, remove the `<!-- TODO -->` line, and paste the full article content in Markdown format below the frontmatter.

---

## PAGE STRUCTURE

| File | URL | Purpose |
|------|-----|---------|
| `src/pages/index.astro` | `/` | Homepage with hero, services grid, about preview, contact |
| `src/pages/about.astro` | `/about` | About Clifford Chigbu + office info sidebar |
| `src/pages/contact.astro` | `/contact` | Contact form + office info + Google Map |
| `src/pages/family-law.astro` | `/family-law` | Family law practice area |
| `src/pages/bankruptcy-law.astro` | `/bankruptcy-law` | Bankruptcy practice area |
| `src/pages/immigration-law.astro` | `/immigration-law` | Immigration practice area |
| `src/pages/personal-injury.astro` | `/personal-injury` | Personal injury practice area |
| `src/pages/auto-accident.astro` | `/auto-accident` | Auto accident practice area |
| `src/pages/business-law.astro` | `/business-law` | Business law practice area |
| `src/pages/blog/index.astro` | `/blog` | Blog listing (auto-generated from posts) |
| `src/pages/blog/[...slug].astro` | `/blog/[slug]` | Individual blog post template |
| `public/404.html` | any unmatched URL | Custom 404 page |
| `public/_redirects` | old URLs | 301 redirects from Squarespace/WordPress |
| `public/robots.txt` | `/robots.txt` | SEO crawler instructions |
| `public/favicon.svg` | `/favicon.svg` | Scales of justice logo |
| `public/og-image.svg` | `/og-image.svg` | Social media share image |

---

## DEPLOY

### One-time setup: Connect GitHub for auto-deploy

1. Push this code to a GitHub repo
2. Cloudflare dashboard → Workers & Pages → `chigbulaws` Worker → Settings → Builds
3. Connect the GitHub repo
4. Build command: `npm run build`
5. Deploy command: `npx wrangler deploy`
6. Production branch: `main`

### After setup, the workflow is

1. Edit or add files on GitHub (web editor or local)
2. Commit to `main`
3. Cloudflare auto-builds and deploys
4. Share new blog posts to Google Business Profile, Facebook, X.com

### Manual deploy

```bash
npm install
npm run deploy    # builds + deploys in one command
```

**Do not deploy without Bryan's explicit permission.**

### Local preview

```bash
npm install
npm run dev       # opens at http://localhost:4321
```

---

## TECH STACK

- **Astro 5** — Static site generator, builds to `./dist`
- **Cloudflare Workers Static Assets** — Serves files from Cloudflare's edge
- **Wrangler 4** — CLI for deploying to Cloudflare
- **Workers Builds** — GitHub integration for auto-deploy (optional but recommended)

## THE 404 FIX

The old Worker had `html_handling: "none"` which caused 404s on clean URLs like `/about`. This project uses Astro's `build.format: "directory"` which generates `/about/index.html`, combined with `html_handling: "auto-trailing-slash"` in `wrangler.jsonc`. No more 404s.

## WRANGLER CONFIG

The `wrangler.jsonc` deploys to the existing `chigbulaws` Worker with routes for:

- `chigbulaws.com/*`
- `www.chigbulaws.com/*`

Both point to the same Worker. The www variant is handled via the routes directly.

## RELATED FILES

- `.cursorrules` — mandatory Cursor/LLM operating rules
- `agents/HERMES-BLOG-AGENT.md` — monthly blog/share subagent training card
- `SEO-AGENT.md` — broader SEO / backlink safety rules
