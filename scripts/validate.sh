#!/usr/bin/env bash
set -euo pipefail
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

npm test
npm run check
npm run build
node src/cli.js --help >/dev/null
node src/cli.js --version >/dev/null
node src/cli.js summarize --ledger fixtures/ledger.json > "$tmp_dir/approval-summary.md"
node src/cli.js validate --ledger fixtures/ledger.json --out "$tmp_dir/audit"
test -s "$tmp_dir/approval-summary.md"
test -s "$tmp_dir/audit/approval-audit.json"
test -s "$tmp_dir/audit/approval-summary.md"
echo "smoke ok"
