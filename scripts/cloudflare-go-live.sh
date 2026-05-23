#!/usr/bin/env bash
# Go live: chigbulaws.com via Worker chigbulaws + R2 (default).
# Legacy Pages mode: HOSTING=pages ./scripts/cloudflare-go-live.sh
#
# Token needs: Zone DNS Edit, Workers Scripts Edit, R2 Object Read/Write.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOSTING="${HOSTING:-worker}"
DOMAIN="${SITE_DOMAIN:-chigbulaws.com}"
PAGES_PROJECT="${PAGES_PROJECT_NAME:-chigbulaws}"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "Set CLOUDFLARE_API_TOKEN." >&2
  exit 1
fi

api() {
  curl -sS -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "Content-Type: application/json" "$@"
}

if [[ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  CLOUDFLARE_ACCOUNT_ID="$(api "https://api.cloudflare.com/client/v4/accounts" | python3 -c "
import sys, json
d = json.load(sys.stdin)
if not d.get('success') or not d.get('result'):
    raise SystemExit('Cannot list accounts: ' + str(d))
print(d['result'][0]['id'])
")"
fi
export CLOUDFLARE_ACCOUNT_ID
echo "Account: ${CLOUDFLARE_ACCOUNT_ID}"
echo "Hosting mode: ${HOSTING}"

ZONE_ID="$(api "https://api.cloudflare.com/client/v4/zones?name=${DOMAIN}" | python3 -c "
import sys, json
d = json.load(sys.stdin)
zones = d.get('result') or []
if not zones:
    raise SystemExit(
        'Zone \"${DOMAIN}\" is not in this Cloudflare account. '
        'Add chigbulaws.com at dash.cloudflare.com (same account as CLOUDFLARE_ACCOUNT_ID) '
        'or use the API token for the account that already owns the zone.'
    )
print(zones[0]['id'])
")"
echo "Zone: ${ZONE_ID}"

export ZONE_ID DOMAIN
api "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?per_page=100" | python3 <<'PY'
import json, os, subprocess, sys

token = os.environ["CLOUDFLARE_API_TOKEN"]
zone = os.environ["ZONE_ID"]
domain = os.environ["DOMAIN"]
data = json.load(sys.stdin)
records = data.get("result") or []

def api_req(method, path, body=None):
    cmd = [
        "curl", "-sS", "-X", method,
        "-H", f"Authorization: Bearer {token}",
        "-H", "Content-Type: application/json",
    ]
    if body is not None:
        cmd += ["-d", json.dumps(body)]
    cmd.append(f"https://api.cloudflare.com/client/v4{path}")
    out = subprocess.check_output(cmd)
    return json.loads(out)

hosts = {domain, f"www.{domain}"}
for r in records:
    name = r.get("name", "")
    if name not in hosts:
        continue
    rtype = r.get("type", "")
    content = (r.get("content") or "").lower()
    rid = r["id"]
    if rtype in ("A", "AAAA"):
        if content.startswith(("104.", "172.", "173.", "188.")) or "squarespace" in content:
            print(f"Delete {rtype} {name} -> {content}")
            api_req("DELETE", f"/zones/{zone}/dns_records/{rid}")
    if rtype == "CNAME" and "squarespace" in content:
        print(f"Delete CNAME {name} -> {content}")
        api_req("DELETE", f"/zones/{zone}/dns_records/{rid}")
PY

if [[ "${HOSTING}" == "pages" ]]; then
  TARGET="${PAGES_PROJECT}.pages.dev"
  echo "Pages mode: deploying to ${TARGET} and setting CNAMEs..."
  export TARGET
  (cd "${ROOT}" && npx --yes wrangler pages deploy . --project-name="${PAGES_PROJECT}" --branch=production)
  api "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?per_page=100" | python3 <<'PY'
import json, os, subprocess

token = os.environ["CLOUDFLARE_API_TOKEN"]
zone = os.environ["ZONE_ID"]
domain = os.environ["DOMAIN"]
target = os.environ["TARGET"]
data = json.load(sys.stdin)

def api_req(method, path, body=None):
    cmd = ["curl", "-sS", "-X", method, "-H", f"Authorization: Bearer {token}", "-H", "Content-Type: application/json"]
    if body is not None:
        cmd += ["-d", json.dumps(body)]
    cmd.append(f"https://api.cloudflare.com/client/v4{path}")
    return json.loads(subprocess.check_output(cmd))

def upsert(host):
    existing = api_req("GET", f"/zones/{zone}/dns_records?type=CNAME&name={host}").get("result") or []
    body = {"type": "CNAME", "name": host, "content": target, "proxied": True, "ttl": 1}
    if existing:
        api_req("PATCH", f"/zones/{zone}/dns_records/{existing[0]['id']}", body)
        print(f"Updated CNAME {host} -> {target}")
    else:
        api_req("POST", f"/zones/{zone}/dns_records", body)
        print(f"Created CNAME {host} -> {target}")

upsert(domain)
upsert(f"www.{domain}")
PY
  echo "Test: https://${TARGET} and https://${DOMAIN}"
else
  echo "Worker mode: syncing R2 and deploying chigbulaws (custom domains in wrangler.toml)..."
  (cd "${ROOT}" && npm run deploy)
  echo "Test: https://${DOMAIN}/"
  echo "If custom domains are not Active, add them under Workers & Pages → chigbulaws → Domains & Routes."
fi
