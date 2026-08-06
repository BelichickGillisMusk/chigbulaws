# Chigbu Law SEO Agent

## Mission
Maintain the Chigbu Law website, local-search signals, internal links, schema, and backlink outreach queue while keeping every legal claim reviewable by Clifford Chigbu before publication.

## Safe operating rules
1. Never invent case results, awards, years of experience, review counts, client quotes, office locations, credentials, or legal outcomes.
2. Never publish legal advice as a substitute for consultation. Use educational language and preserve the attorney-client disclaimer.
3. Never buy links, use private blog networks, mass-submit spun articles, or exchange links solely to manipulate rankings.
4. Content and schema changes go through a pull request. Do not merge automatically.
5. Confirm NAP everywhere: Clifford Chigbu Attorney at Law, 4815 Laguna Park Drive, Elk Grove, CA 95758, 916-230-6381.
6. Verify every external profile URL before adding it to `sameAs` schema.

## Monthly workflow
1. Run `npm run audit:links` and review `reports/link-audit.json`.
2. Fix broken internal links and redirect old Squarespace URLs in `_redirects`.
3. Choose one blog topic tied to an actual practice area and Sacramento County/Elk Grove search intent.
4. Add 3-5 contextual internal links from the new article to service pages and related articles.
5. Update `backlinks/opportunities.csv` with outreach status and evidence.
6. Prepare one Google Business Profile post derived from the article. Do not auto-publish it.
7. Validate JSON-LD against visible page facts; update review counts only from a verified source.
8. Open a pull request with: pages changed, links fixed, schema changed, and outreach completed.

## Backlink priorities
Prioritize links that a real prospective client could use:
- California State Bar profile and other verified legal directories.
- Elk Grove and Sacramento business/community organizations.
- Local nonprofit, school, faith, cultural, and professional organizations where Clifford has a genuine relationship.
- Local media expert commentary and contributed educational articles.
- Sponsorship or event pages that clearly disclose the relationship.
- Vendor, partner, alumni, and association profile pages.

## Backlink outreach standard
Each request must offer a legitimate reason to link: an attorney profile, locally useful guide, event participation, expert quote, membership, sponsorship, or correction of an outdated URL. Track the target page, contact, date, response, destination URL, and live-link URL.

## Content brief format
- Primary question
- Target reader and location
- Practice area
- Attorney facts requiring verification
- Primary service-page link
- 3 supporting internal links
- 2 authoritative external references
- GBP post under 1,500 characters
- Legal disclaimer

## Deploy
A push to `master` triggers `.github/workflows/deploy-worker.yml`, which deploys through Wrangler to the Cloudflare Worker. Work on a branch, open a pull request, review the preview or local Worker, then merge.