#!/usr/bin/env bash
# Fix chigbulaws.com on Cloudflare Pages + DNS (Error 1000).
# Token needs: Zone DNS Edit, Account Cloudflare Pages Edit (for chigbulaws.com zone).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_NAME="${PAGES_PROJECT_NAME:-chigbulaws}"
DOMAIN="${SITE_DOMAIN:-chigbulaws.com}"

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
echo "Account: ${CLOUDFLARE_ACCOUNT_ID}"

ZONE_ID="$(api "https://api.cloudflare.com/client/v4/zones?name=${DOMAIN}" | python3 -c "
import sys, json
d = json.load(sys.stdin)
zones = d.get('result') or []
if not zones:
    raise SystemExit(
        'Zone \"${DOMAIN}\" not in this Cloudflare account. '
        'Add the domain at dash.cloudflare.com and point nameservers to Cloudflare.'
    )
print(zones[0]['id'])
")"
echo "Zone: ${ZONE_ID}"

echo "Deploying to Pages project ${PROJECT_NAME}..."
export CLOUDFLARE_ACCOUNT_ID
(cd "${ROOT}" && npx --yes wrangler@3 pages deploy . --project-name="${PROJECT_NAME}" --branch=production)

TARGET="${PROJECT_NAME}.pages.dev"
echo "Fixing DNS for ${DOMAIN} -> ${TARGET}"

export ZONE_ID DOMAIN TARGET
api "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?per_page=100" | python3 <<'PY'
import json, os, subprocess, sys

token = os.environ["CLOUDFLARE_API_TOKEN"]
zone = os.environ["ZONE_ID"]
domain = os.environ["DOMAIN"]
target = os.environ["TARGET"]
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
