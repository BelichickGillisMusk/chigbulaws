# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is **Chigbu Law** — a static marketing website for a law firm. The tech stack is plain HTML, CSS, and vanilla JavaScript with no build system, no package manager, and no server-side code. It is deployed to Cloudflare Pages (see `wrangler.toml`).

### Running the dev server

Serve the site locally with any static file server from the repo root:

```
npx serve -l 3000 /workspace
```

Or alternatively: `python3 -m http.server 3000`

All pages are accessible at `http://localhost:3000/`. The `serve` tool uses clean URLs (no `.html` extension needed).

### Linting

There is no project-level lint configuration. Use globally installed tools:

- **HTML**: `htmlhint *.html blog/*.html`
- **JS**: `jshint --config <(echo '{"esversion": 6, "browser": true}') main.js forms.js`
- **CSS**: `csslint --quiet style.css forms.css`

Pre-existing warnings exist (function declarations in blocks, CSS property order) — these are not regressions.

### Forms

Contact/intake forms submit to Formspree (external SaaS). In local dev, form submissions will succeed client-side but the actual delivery depends on the Formspree endpoint being configured.

### Key files

- `index.html` — Homepage
- `style.css` / `forms.css` — All styles
- `main.js` — Navigation, scroll, cookie banner
- `forms.js` — Multi-step intake form logic
- `_redirects` — Cloudflare Pages redirect rules
- `wrangler.toml` — Cloudflare Pages project config
