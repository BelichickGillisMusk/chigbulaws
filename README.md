# Clifford Chigbu Attorney at Law — chigbulaws.com

Website for **Clifford Chigbu, Attorney at Law** (Elk Grove, CA).  
Built with **Astro 5**, deployed on **Cloudflare Workers Static Assets**.

> Cursor agents: read **`.cursorrules`** before any change. Bryan must approve architecture, design, config, and deploys.

## Business info

| Field | Value |
|-------|--------|
| Name | Clifford Chigbu, Attorney at Law |
| Phone | 916-230-6381 |
| Email | chigbulaw@sbcglobal.net |
| Intake (contact form) | **chigbulaw@sbcglobal.net** AND **fsu9913@gmail.com** |
| Address | 4815 Laguna Park Dr, Suite C, Elk Grove, CA 95758 |
| Website | https://chigbulaws.com |
| Google Business Profile | https://share.google/SVzBMps2zWv25qirL |
| Facebook | https://www.facebook.com/chigbulaw |
| Design credit | [MLB Marketing LLC](https://mlbmarketingllc.com) |

## What Cursor may do without approval

1. Add blog posts as `.md` in `src/content/blog/`
2. Edit existing blog `.md` files
3. Edit text in existing `.astro` pages (typos, wording, facts)
4. Add redirect entries to `public/_redirects`

## What requires Bryan's approval

- New `.astro` pages/files
- Changes to `BaseLayout.astro` / `PracticeLayout.astro`
- Changes to `wrangler.jsonc`, `astro.config.mjs`, or `package.json`
- New npm dependencies
- Design / colors / fonts / styling
- Tech-stack or project restructure
- Deleting files
- Deploying
- Touching any other Worker or project
- Changing URL paths, redirects structure, or page structure (SEO)

## Blog posts

### Template

```markdown
---
title: "Post Title Here"
description: "One-sentence summary for SEO and blog listing."
pubDate: 2026-08-08
author: "Clifford Chigbu"
tags: ["family-law", "elk-grove"]
draft: false
---

Write the post content here in Markdown.
```

### Tags (use 1–3)

| Tag | Category |
|-----|----------|
| firm-recognition | Firm Recognition |
| law-updates | Law Updates |
| family-law | Family Law |
| immigration | Immigration |
| business-law | Business Law |
| auto-accident | Auto Accident |
| personal-injury | Personal Injury |
| divorce | Family Law |
| legislation | Law Updates |
| california | Law Updates |
| sacramento | Local Resources |
| elk-grove | Local Resources |
| personal-story | Immigration |
| compliance | Business Law |
| basics | Family Law |
| **firm-news** | **Firm News** |

### Rules

- Professional, accessible tone
- First person for personal stories; third person for informational posts
- About 500–1500 words
- End with CTA to `/contact` or 916-230-6381
- No case-specific legal advice
- Footer holds the global disclaimer

### Social sharing after publish

1. Google Business Profile (≤1500 chars + URL)
2. Facebook (`chigbulaw`) caption + URL
3. X.com short caption + URL

## Deploy (Bryan approval required)

```bash
npm install
npm run deploy
```

Or push to `main` if Workers Builds / GitHub auto-deploy is connected.

## 404 / URL handling

Do **not** revert to `html_handling: "none"`.  
This project expects Astro `build.format: "directory"` with `html_handling: "auto-trailing-slash"`.

## Current migration note

Until the Astro `src/layouts/` + `src/pages/` merge from Cloudflare’s starter cards is complete, keep NAP, forms, blog HTML, and SEO fixes consistent with `.cursorrules`. Do not invent a parallel stack without Bryan’s approval.
