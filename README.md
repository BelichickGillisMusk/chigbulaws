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

5. Choose 1–3 tags from the table below (include `firm-news` for firm announcements).
6. Commit to `main` (or open a PR if Bryan prefers review first).
7. After publish, share the live URL on **Google Business Profile**, **Facebook**, and **X.com**.

### For Cursor / LLMs

1. Read `.cursorrules` first.
2. Create `src/content/blog/<slug>.md` using the template above.
3. Do not create new frameworks, pages, layouts, or dependencies.
4. Prepare share drafts for GBP / Facebook / X.com in the PR description.
5. Do **not** deploy unless Bryan explicitly approves.

---

## BLOG TAGS (use 1–3 per post)

| Tag | Shows as category |
|-----|-------------------|
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
| firm-news | Firm News |

## BLOG POST RULES

- **Tone:** Professional but accessible. Attorney speaking to potential clients.
- **Voice:** First person for personal stories; third person for informational posts.
- **Length:** 500–1500 words typical.
- **Always end with:** A call-to-action pointing to `/contact` or calling 916-230-6381.
- **Never include:** Specific legal advice for individual cases.
- **No disclaimer needed:** Global disclaimer is in the footer.

## SOCIAL SHARING (after each published post)

1. **Google Business Profile** — ≤1500 characters + live post URL (`https://share.google/SVzBMps2zWv25qirL`)
2. **Facebook** — caption + live URL for https://www.facebook.com/chigbulaw
3. **X.com** — short caption + live URL

---

## WHAT REQUIRES BRYAN'S APPROVAL

1. New `.astro` files or pages
2. Changes to `BaseLayout.astro` or `PracticeLayout.astro`
3. Changes to `wrangler.jsonc`, `astro.config.mjs`, or `package.json`
4. New npm dependencies
5. Design, colors, fonts, or styling changes
6. Restructuring the project or changing the tech stack
7. Deleting existing files
8. Deploying
9. Touching any other Worker or project folder
10. Changing URL paths, redirects structure, or page structure (SEO protection)

## DEPLOY (Bryan approval required)

```bash
npm install
npm run deploy    # builds + deploys to Cloudflare Workers
```

Or, if GitHub auto-deploy / Workers Builds is connected, `git push` to `main`.

**Do not deploy without Bryan's explicit permission.**

## THE 404 FIX

The old Worker had `html_handling: "none"` causing 404s on clean URLs. This project uses Astro `build.format: "directory"` + `html_handling: "auto-trailing-slash"`. Do not change these settings.

## RELATED FILES

- `.cursorrules` — mandatory Cursor/LLM operating rules
- `agents/HERMES-BLOG-AGENT.md` — monthly blog/share subagent training card
- `SEO-AGENT.md` — broader SEO / backlink safety rules
