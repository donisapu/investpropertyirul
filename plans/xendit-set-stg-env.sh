#!/usr/bin/env bash
# Usage: copy the value in the Xendit dashboard first, then:
#   ./plans/xendit-set-stg-env.sh XENDIT_SECRET_KEY
#   ./plans/xendit-set-stg-env.sh XENDIT_CALLBACK_TOKEN
# Reads the value from the macOS clipboard and writes it to the STAGING .env only.
# Never echoes the value. Backs up .env once per run.
set -euo pipefail

KEY="${1:?key name required}"
case "$KEY" in XENDIT_SECRET_KEY|XENDIT_CALLBACK_TOKEN) ;; *) echo "unsupported key" >&2; exit 1 ;; esac

VAL="$(pbpaste | tr -d '[:space:]')"
[ -n "$VAL" ] || { echo "clipboard empty" >&2; exit 1; }
if [ "$KEY" = XENDIT_SECRET_KEY ] && [[ "$VAL" != xnd_development_* ]]; then
  echo "clipboard is not a test secret key (xnd_development_...)" >&2; exit 1
fi

REMOTE_SCRIPT=$(cat <<'REMOTE'
set -euo pipefail
cd /var/www/gainproperties-staging
VAL="$(cat)"
cp -p .env ".env.bak.$(date +%Y%m%d%H%M%S)"
tmp="$(mktemp)"
awk -v k="$KEY" -v v="$VAL" 'BEGIN{d=0} $0 ~ "^"k"=" {print k"="v; d=1; next} {print} END{if(!d) print k"="v}' .env > "$tmp"
cat "$tmp" > .env && rm -f "$tmp"
sudo -u www-data HOME=/tmp php artisan config:cache >/dev/null
echo "$KEY updated (len ${#VAL}), config cached"
REMOTE
)
printf '%s' "$VAL" | ssh -i ~/.ssh/id_ed25519_work root@178.16.131.129 "KEY=$KEY bash -c $(printf '%q' "$REMOTE_SCRIPT")"
pbcopy </dev/null
