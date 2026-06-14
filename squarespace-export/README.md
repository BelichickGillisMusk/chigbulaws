# Squarespace / WordPress export

## File: `Squarespace-Chigbu_old_Wordpress-Export-05-18-2026.xml`

This export was uploaded on 2026-05-18. **It does not contain the old site content** — only channel metadata (title, authors, one category) and nine empty `<item />` entries. There are no pages, blog posts, or media URLs inside the XML.

**You do not need this file to go live.** The static site at the repo root is the replacement and is already more complete than this export.

### If you need copy or images from Squarespace

1. In Squarespace: **Settings → Developer Tools → Export** (or use a full WordPress-compatible export that includes posts and attachments).
2. Or download individual assets from the live Squarespace site before canceling hosting.
3. Drop any images here (e.g. `logo.png`, `og-image.jpg`, photos) and we can wire them into `index.html` and service pages.

### Old site vs new site

| | Old (Squarespace) | New (this repo) |
|---|-------------------|-----------------|
| Problem right now | DNS Error 1000 (wrong A records) | Same DNS fix — not a content issue |
| Pages | Squarespace-hosted | `index.html`, service pages, `blog/` |
| Going live | N/A until DNS fixed | Worker `chigbulaws` custom domain — see [GO-LIVE.md](../GO-LIVE.md) |

The new site is not the blocker; **Cloudflare DNS** for `chigbulaws.com` is.
