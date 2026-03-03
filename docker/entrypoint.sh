#!/bin/sh
# Fix permissions pour les volumes Docker (montés en root par défaut)
# Permet à l'app (nextjs) d'écrire dans /app/data et /app/uploads sur le VPS
chown -R nextjs:nodejs /app/data /app/uploads 2>/dev/null || true
exec su-exec nextjs "$@"
