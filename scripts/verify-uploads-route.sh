#!/bin/sh
# Garde-fou : échoue si les routes uploads sont absentes.
# Exécuté avant next build dans le Dockerfile pour garantir leur inclusion.
set -e
ROOT_DIR='app/api/uploads'
CATCHALL_FILE="$ROOT_DIR/[...path]/route.ts"
ROUTE_FILE="$ROOT_DIR/route.ts"
if [ ! -f "$CATCHALL_FILE" ]; then
  echo "ERROR: Missing $CATCHALL_FILE - uploads API (catch-all) will not be available." >&2
  exit 1
fi
if [ ! -f "$ROUTE_FILE" ]; then
  echo "ERROR: Missing $ROUTE_FILE - uploads API route missing." >&2
  exit 1
fi
echo "OK: $ROUTE_FILE and $CATCHALL_FILE present."
