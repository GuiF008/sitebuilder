#!/bin/sh
# Garde-fou : échoue si les routes uploads sont absentes.
# Exécuté avant next build dans le Dockerfile pour garantir leur inclusion.
# On ne teste pas le nom exact "[...path]" (crochets mal gérés selon shell/COPY).
set -e
ROOT_DIR='app/api/uploads'

if [ ! -f "$ROOT_DIR/route.ts" ]; then
  echo "ERROR: Missing $ROOT_DIR/route.ts - uploads API route missing." >&2
  exit 1
fi

# Vérifier qu'un sous-dossier contient route.ts (catch-all Next.js)
FOUND=0
for sub in "$ROOT_DIR"/*/; do
  if [ -f "${sub}route.ts" ]; then
    FOUND=1
    break
  fi
done
if [ "$FOUND" -eq 0 ]; then
  echo "ERROR: No catch-all route under $ROOT_DIR (expected a subfolder with route.ts)." >&2
  exit 1
fi

echo "OK: $ROOT_DIR/route.ts and catch-all present."
