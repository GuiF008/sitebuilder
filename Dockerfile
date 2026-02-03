# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Create data directories
RUN mkdir -p /app/data /app/uploads
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/app/data/sitebuilder.db"

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
