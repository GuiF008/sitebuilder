#!/bin/sh
# Vérifie que le build Next.js a bien inclus les routes /api/uploads.
# À exécuter après "npm run build".
# En standalone, ces fichiers sont ensuite regroupés dans server.js.
set -e
UPLOADS_ROUTE='.next/server/app/api/uploads/route.js'
if [ ! -f "$UPLOADS_ROUTE" ]; then
  echo "ERROR: After build, $UPLOADS_ROUTE is missing. Uploads API may 404 in prod." >&2
  exit 1
fi
if [ ! -f ".next/server/app/api/uploads/[...path]/route.js" ]; then
  echo "ERROR: After build, .next/server/app/api/uploads/[...path]/route.js is missing." >&2
  exit 1
fi
echo "OK: .next/server/app/api/uploads present (route.js + [...path]/route.js)."
