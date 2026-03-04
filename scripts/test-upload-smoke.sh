#!/bin/bash
# Smoke test: upload d'un fichier + vérification GET sur l'URL renvoyée
# Usage: BASE_URL=http://localhost:3000 SITE_ID=<uuid> ./scripts/test-upload-smoke.sh

set -e

BASE_URL="${BASE_URL:-http://localhost:3000}"
SITE_ID="${SITE_ID:?SITE_ID requis (ex: obtenir depuis prisma studio ou la BDD)}"

# Créer un mini PNG 1x1 valide dans un fichier temp (portable GNU/macOS)
PNG_B64="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
TMP_PNG=$(mktemp)
(echo "$PNG_B64" | base64 -d 2>/dev/null || echo "$PNG_B64" | base64 -D 2>/dev/null) > "$TMP_PNG"
trap "rm -f $TMP_PNG" EXIT

echo "=== Smoke test upload/media ==="
echo "BASE_URL=$BASE_URL SITE_ID=$SITE_ID"
echo ""

# 1) Upload
echo "1. Upload vers POST /api/sites/$SITE_ID/media ..."
RESP=$(curl -s -w "\n%{http_code}" -X POST \
  -F "file=@$TMP_PNG;filename=smoke-test.png;type=image/png" \
  "$BASE_URL/api/sites/$SITE_ID/media")

HTTP_BODY=$(echo "$RESP" | head -n -1)
HTTP_CODE=$(echo "$RESP" | tail -n 1)

if [ "$HTTP_CODE" != "200" ]; then
  echo "ERREUR: upload a retourné $HTTP_CODE"
  echo "$HTTP_BODY" | head -5
  exit 1
fi

# Extraire l'URL (format JSON: {"media":{"url":"/uploads/...","filename":"..."}})
MEDIA_URL=$(echo "$HTTP_BODY" | grep -o '"/uploads/[^"]*"' | head -1 | tr -d '"')
if [ -z "$MEDIA_URL" ]; then
  echo "ERREUR: pas d'URL dans la réponse"
  echo "$HTTP_BODY"
  exit 1
fi

echo "   OK - URL reçue: $MEDIA_URL"
echo ""

# 2) GET sur l'URL
echo "2. GET $BASE_URL$MEDIA_URL ..."
GET_RESP=$(curl -s -w "\n%{http_code}\n%{content_type}" -o /tmp/smoke-download.bin "$BASE_URL$MEDIA_URL")
GET_CODE=$(echo "$GET_RESP" | tail -n 2 | head -1)
GET_CT=$(echo "$GET_RESP" | tail -n 1)

if [ "$GET_CODE" != "200" ]; then
  echo "ERREUR: GET a retourné $GET_CODE"
  exit 1
fi

if [[ ! "$GET_CT" =~ image/ ]]; then
  echo "ERREUR: Content-Type attendu image/*, reçu: $GET_CT"
  exit 1
fi

echo "   OK - Status 200, Content-Type: $GET_CT"
echo ""
echo "=== Smoke test réussi ==="
