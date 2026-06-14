#!/usr/bin/env bash
# Push Cloudflare credentials from this environment into GitHub Actions.
# Requires: gh CLI logged in with org admin (repo or org secrets: write).
#
# Org secrets:  https://github.com/organizations/BelichickGillisMusk/settings/secrets/actions
# Org variables: https://github.com/organizations/BelichickGillisMusk/settings/variables/actions
set -euo pipefail

ORG="${GITHUB_ORG:-BelichickGillisMusk}"
REPO="${GITHUB_REPO:-BelichickGillisMusk/chigbulaws}"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  if printenv | grep -qi '^cloudflare token='; then
    eval "$(printenv | grep -i '^cloudflare token=' | sed 's/^cloudflare token=/CLOUDFLARE_API_TOKEN=/' | head -1)"
    export CLOUDFLARE_API_TOKEN
  fi
fi

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "Set CLOUDFLARE_API_TOKEN or inject 'cloudflare token' in the environment." >&2
  exit 1
fi

ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-bafa242dd95d3fdce72540d20accd0a2}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [[ -f "${ROOT}/wrangler.toml" ]]; then
  from_toml="$(grep -E '^\s*account_id\s*=' "${ROOT}/wrangler.toml" | head -1 | sed -E 's/.*=\s*"([^"]+)".*/\1/')"
  [[ -n "${from_toml}" ]] && ACCOUNT_ID="${from_toml}"
fi

echo "Organization: ${ORG}"
echo "Account ID:   ${ACCOUNT_ID}"
echo "Token length: ${#CLOUDFLARE_API_TOKEN}"

set_org() {
  echo -n "${CLOUDFLARE_API_TOKEN}" | gh secret set CLOUDFLARE_API_TOKEN -o "${ORG}" --visibility all -a actions
  echo -n "${ACCOUNT_ID}" | gh variable set CLOUDFLARE_ACCOUNT_ID -o "${ORG}" --visibility all
  echo "Set org secret CLOUDFLARE_API_TOKEN and org variable CLOUDFLARE_ACCOUNT_ID."
}

set_repo() {
  echo -n "${CLOUDFLARE_API_TOKEN}" | gh secret set CLOUDFLARE_API_TOKEN -R "${REPO}"
  echo -n "${ACCOUNT_ID}" | gh secret set CLOUDFLARE_ACCOUNT_ID -R "${REPO}"
  echo "Set repo secrets CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID on ${REPO}."
}

if set_org 2>/dev/null; then
  :
elif set_repo 2>/dev/null; then
  :
else
  echo ""
  echo "gh could not write secrets (need org admin or repo admin)."
  echo "Set manually:"
  echo "  Secret  CLOUDFLARE_API_TOKEN  = (cloudflare token from your env)"
  echo "  Variable CLOUDFLARE_ACCOUNT_ID = ${ACCOUNT_ID}"
  echo "  https://github.com/organizations/${ORG}/settings/secrets/actions"
  echo "  https://github.com/organizations/${ORG}/settings/variables/actions"
  exit 1
fi
