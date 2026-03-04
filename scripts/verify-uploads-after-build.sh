#!/bin/sh
# Vérifie que le build Next.js a bien inclus les routes /api/uploads.
# À exécuter après "npm run build".
# En standalone, ces fichiers sont ensuite regroupés dans server.js.
# On ne teste pas le nom exact "[...path]" (crochets mal gérés selon shell).
set -e
UPLOADS_DIR='.next/server/app/api/uploads'

if [ ! -f "$UPLOADS_DIR/route.js" ]; then
  echo "ERROR: After build, $UPLOADS_DIR/route.js is missing. Uploads API may 404 in prod." >&2
  exit 1
fi

FOUND=0
for sub in "$UPLOADS_DIR"/*/; do
  if [ -f "${sub}route.js" ]; then
    FOUND=1
    break
  fi
done
if [ "$FOUND" -eq 0 ]; then
  echo "ERROR: After build, no catch-all route.js under $UPLOADS_DIR." >&2
  exit 1
fi

echo "OK: .next/server/app/api/uploads present (route.js + catch-all)."
