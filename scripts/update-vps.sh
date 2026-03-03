#!/bin/bash
# Script de mise à jour sur VPS - exécuter depuis /opt/sitebuilder (ou le dossier du projet)
set -e
echo "=== Mise à jour OVHcloud Site Builder ==="
git pull
echo "--- Rebuild Docker ---"
docker compose up -d --build
echo "--- Appliquer le schéma Prisma ---"
docker exec sitebuilder-app npx prisma db push
echo "=== Mise à jour terminée ==="
