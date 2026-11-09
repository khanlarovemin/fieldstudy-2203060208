#!/usr/bin/env bash
# Takes a full-screen screenshot into evidence/ and records it in source/evidence-log.md.
#
#   tools/snap.sh <ID-short-name> "<what it shows>" [page-address]
#
#   tools/snap.sh A1-padlock "Padlock: certificate valid, issuer and expiry date"
#   SNAP_COUNT=3 SNAP_INTERVAL=3 tools/snap.sh B1-loading "Home page loading on Slow 3G"
#
# After the countdown, switch to Chrome; the main screen is captured (address bar and menu-bar clock visible).
# If no page address is given, the address of Chrome's active tab is used.
# Environment: SNAP_DELAY (default 5 s), SNAP_COUNT (default 1), SNAP_INTERVAL (default 2 s).
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
log="$root/source/evidence-log.md"

usage() {
  sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
  exit 1
}

[[ $# -ge 1 ]] || usage
name="${1%.png}"
what="${2:-}"
url="${3:-}"
delay="${SNAP_DELAY:-5}"
count="${SNAP_COUNT:-1}"
interval="${SNAP_INTERVAL:-2}"

if [[ ! "$name" =~ ^(A[1-7]|B[1-8]|S[12](-[AB][1-8])?|C[0-9]*)-[a-z0-9-]+$ ]]; then
  echo "Name should look like A4-missing-page or B3-offline (checklist ID, then lowercase words with hyphens)." >&2
  exit 1
fi
id="${name%%-*}"
[[ "$name" =~ ^S[12]-([AB][1-8])- ]] && id="${name%%-*}-${BASH_REMATCH[1]}"

active_tab_url() {
  osascript -e 'tell application "Google Chrome" to get URL of active tab of front window' 2>/dev/null || true
}

escape_cell() {
  printf '%s' "$1" | sed 's/|/\\|/g'
}

record_row() {
  local file="$1" stamp="$2" page="$3"
  local tmp
  tmp="$(mktemp)"
  grep -vF "| $file |" "$log" > "$tmp" || true
  printf '| %s | %s | %s | %s | %s |\n' "$id" "$file" "$(escape_cell "$what")" "$stamp" "$(escape_cell "$page")" >> "$tmp"
  mv "$tmp" "$log"
}

echo "Switch to Chrome now. Capturing in ${delay}s..."
for ((i = delay; i > 0; i--)); do
  printf '%s ' "$i"
  sleep 1
done
echo

for ((n = 1; n <= count; n++)); do
  if ((count > 1)); then file="evidence/${name}-${n}.png"; else file="evidence/${name}.png"; fi
  screencapture -x -m "$root/$file"
  stamp="$(date '+%Y-%m-%d %H:%M:%S')"
  page="${url:-$(active_tab_url)}"
  record_row "$file" "$stamp" "$page"
  afplay /System/Library/Sounds/Tink.aiff 2>/dev/null &
  echo "Saved $file at $stamp ${page:+($page)}"
  if ((n < count)); then sleep "$interval"; fi
done

[[ -n "$what" ]] || echo "Note: add a 'What it shows' description in source/evidence-log.md."
[[ -n "${page:-}" ]] || echo "Note: no page address found; add it in source/evidence-log.md."
