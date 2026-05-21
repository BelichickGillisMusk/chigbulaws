# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a **purely static website** (HTML, CSS, vanilla JS) for a law firm — no build tools, no package managers, no frameworks. There are zero npm/pip/etc. dependencies.

### Running the dev server

Serve the site with any static HTTP server from the repo root:

```bash
python3 -m http.server 8080 --directory /workspace
```

The site is then available at `http://localhost:8080/`.

### Key notes

- **No linter/test framework** is configured in this repo. Validation is visual (browser check).
- **No build step** — all files are served as-is.
- **Forms** submit to Formspree (`https://formspree.io/f/xpwzgkqp`); they fall back to `mailto:` without network.
- **Deployment** targets Cloudflare Pages (see `wrangler.toml`). The `_redirects` file is Cloudflare-specific and won't apply on a local dev server.
- **External CDN assets** (Google Fonts, Unsplash images, Google Maps embed) require internet access for full visual fidelity; the site is functional without them.
