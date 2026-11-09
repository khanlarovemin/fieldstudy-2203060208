#!/usr/bin/env bash
# Builds the PDFs. Usage: tools/build.sh [core|stretch|all]
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
if [[ ! -d "$here/node_modules/marked" ]]; then
  npm --prefix "$here" install --silent --no-audit --no-fund
fi
node "$here/build.mjs" "$@"
