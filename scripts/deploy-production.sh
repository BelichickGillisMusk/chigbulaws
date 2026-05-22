#!/usr/bin/env bash
# Deploy chigbulaws.com: R2 sync + silverback-google Worker (+ optional DNS fix for Pages).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOMAIN="${SITE_DOMAIN:-chigbulaws.com}"
WORKER_NAME="${WORKER_NAME:-silverback-google}"
R2_BUCKET="${R2_BUCKET_NAME:-chigbulaw}"
MINIMAL="${DEPLOY_MINIMAL:-0}"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  if [[ -n "${cloudflare token:-}" ]]; then
    export CLOUDFLARE_API_TOKEN="${cloudflare token}"
  else
    echo "Set CLOUDFLARE_API_TOKEN (or cloudflare token in Cursor secrets)." >&2
    exit 1
  fi
fi

api() {
  curl -sS -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "Content-Type: application/json" "$@"
}

echo "==> Resolving Cloudflare account..."
if [[ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  CLOUDFLARE_ACCOUNT_ID="$(api "https://api.cloudflare.com/client/v4/accounts" | python3 -c "
import sys, json
d = json.load(sys.stdin)
if not d.get('success') or not d.get('result'):
    raise SystemExit('Cannot list accounts: ' + str(d.get('errors', d)))
print(d['result'][0]['id'])
")"
  export CLOUDFLARE_ACCOUNT_ID
fi
echo "    Account ID: ${CLOUDFLARE_ACCOUNT_ID}"

echo "==> Checking zone ${DOMAIN}..."
ZONE_JSON="$(api "https://api.cloudflare.com/client/v4/zones?name=${DOMAIN}")"
ZONE_COUNT="$(echo "${ZONE_JSON}" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(len(d.get('result') or []))
")"
if [[ "${ZONE_COUNT}" -eq 0 ]]; then
  echo "::error::Zone ${DOMAIN} is not in this Cloudflare account." >&2
  echo "The API token must belong to the account where chigbulaws.com was added." >&2
  echo "Current token only sees:" >&2
  api "https://api.cloudflare.com/client/v4/zones?per_page=50" | python3 -c "
import sys, json
for z in json.load(sys.stdin).get('result') or []:
    print('  -', z['name'])
" >&2 || true
  exit 2
fi
export ZONE_ID="$(echo "${ZONE_JSON}" | python3 -c "import sys,json; print(json.load(sys.stdin)['result'][0]['id'])")"
echo "    Zone ID: ${ZONE_ID}"

echo "==> Installing dependencies..."
(cd "${ROOT}" && npm ci)

echo "==> Syncing static site to R2 (${R2_BUCKET})..."
if [[ "${MINIMAL}" == "1" ]]; then
  (cd "${ROOT}" && npm run sync:r2:minimal)
else
  (cd "${ROOT}" && npm run sync:r2)
fi

echo "==> Deploying Worker (${WORKER_NAME})..."
(cd "${ROOT}" && npx wrangler deploy)

if [[ "${FIX_DNS:-0}" == "1" ]]; then
  echo "==> Fixing DNS (CNAME to Pages) — optional; Worker routes may already be set in dashboard."
  FIX_DNS=1 SITE_DOMAIN="${DOMAIN}" "${ROOT}/scripts/cloudflare-go-live.sh" || true
fi

echo ""
echo "Deploy finished. Verify:"
echo "  - Worker: https://${WORKER_NAME}.${CLOUDFLARE_ACCOUNT_ID}.workers.dev"
echo "  - Site:   https://${DOMAIN}"
