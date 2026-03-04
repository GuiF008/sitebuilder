# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Garde-fou : la route GET /api/uploads doit être présente avant le build
RUN npm run verify:uploads-route

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Garde-fou post-build : les routes uploads doivent être dans le build
RUN npm run verify:uploads-after-build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install Prisma CLI + su-exec (pour fix permissions des volumes Docker)
RUN npm install -g prisma@6.19.2 && apk add --no-cache su-exec

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files (standalone: pas de dossier app/, les routes sont dans server.js)
# Validation uploads: curl -I http://127.0.0.1:3000/api/uploads/<siteId>/<file>.jpg => 200
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Prisma client (serverComponentsExternalPackages = not in standalone)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Create data directories
RUN mkdir -p /app/data /app/uploads
RUN chown -R nextjs:nodejs /app

# Entrypoint: fix permissions des volumes montés (root par défaut) avant de lancer l'app
COPY docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/app/data/sitebuilder.db"

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["sh", "-c", "prisma db push --skip-generate && node server.js"]
