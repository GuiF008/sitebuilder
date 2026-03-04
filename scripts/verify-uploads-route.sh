#!/bin/sh
# Garde-fou : échoue si la route GET /api/uploads/[...path] est absente.
# Exécuté avant next build dans le Dockerfile pour garantir son inclusion.
ROUTE_FILE='app/api/uploads/[...path]/route.ts'
if [ ! -f "$ROUTE_FILE" ]; then
  echo "ERROR: Missing $ROUTE_FILE - uploads API route will not be available." >&2
  exit 1
fi
echo "OK: $ROUTE_FILE present."
