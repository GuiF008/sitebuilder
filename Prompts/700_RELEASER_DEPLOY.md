# 700 — RELEASER (Déploiement & Documentation)

## Rôle général

Tu es responsable de la **publication**, du **déploiement** et de la **documentation** permettant la mise en production et la reprise du projet.

---

## Objectifs

### Déploiement
- Containeriser l'application avec Docker
- Configurer le reverse proxy (Caddy)
- Documenter le déploiement VPS
- S'assurer de la persistance des données

### Documentation
- Rendre le projet compréhensible sans assistance
- Documenter pour utilisateurs et développeurs
- Maintenir le changelog à jour

---

## Docker

### Dockerfile

```dockerfile
# Dockerfile
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
RUN npx prisma generate
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

RUN mkdir -p /app/data /app/uploads
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: sitebuilder-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:/app/data/sitebuilder.db
      - NODE_ENV=production
    volumes:
      - sitebuilder-data:/app/data
      - sitebuilder-uploads:/app/uploads
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  sitebuilder-data:
  sitebuilder-uploads:
```

### Caddyfile

```
sitebuilder.{$DOMAIN} {
    reverse_proxy localhost:3000
    
    encode gzip
    
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
    }
}
```

---

## Déploiement VPS

### Prérequis

- VPS Ubuntu 22.04+
- Docker et Docker Compose installés
- Domaine pointant vers le VPS
- Ports 80 et 443 ouverts

### Étapes

```bash
# 1. Connexion
ssh user@votre-vps-ip

# 2. Cloner
cd /opt
git clone <repo-url> sitebuilder
cd sitebuilder

# 3. Configuration
cp .env.example .env
# Modifier si nécessaire

# 4. Build et lancement
docker compose up -d --build

# 5. Vérification
docker compose logs -f app
curl http://localhost:3000/api/health
```

### Configuration Caddy

```bash
# Installer Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Configurer
sudo nano /etc/caddy/Caddyfile
# Ajouter la config ci-dessus

# Recharger
sudo systemctl reload caddy
```

### Maintenance

```bash
# Logs
docker compose logs -f app

# Redémarrer
docker compose restart

# Mise à jour
git pull
docker compose up -d --build

# Sauvegarde
docker cp sitebuilder-app:/app/data ./backup/
docker cp sitebuilder-app:/app/uploads ./backup/
```

---

## Documentation

### README.md

```markdown
# OVHcloud Site Builder

Créateur de sites web simple, sans compte requis.

## Fonctionnalités

- ✅ Création sans inscription
- ✅ Onboarding 5 étapes avec galerie de thèmes
- ✅ Éditeur avec modale accordéon (420px)
- ✅ Modifications temps réel
- ✅ Drag & drop d'images
- ✅ Sites multipages avec navigation
- ✅ Publication en 1 clic

## Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Prisma + SQLite
- Docker

## Installation locale

\`\`\`bash
git clone <repo>
cd sitebuilder
npm install
echo 'DATABASE_URL="file:./dev.db"' > .env
npx prisma migrate dev
npm run dev
\`\`\`

→ http://localhost:3000

## Déploiement

Voir [DEPLOY_VPS.md](./docs/DEPLOY_VPS.md)

## Documentation

- [Guide utilisateur](./docs/USER_GUIDE.md)
- [API](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)
```

### USER_GUIDE.md

```markdown
# Guide Utilisateur

## Créer votre site

### Étape 1 : Démarrer
1. Allez sur la page d'accueil
2. Cliquez sur "Créer mon site"

### Étape 2 : Informations
1. Entrez le nom de votre site
2. Entrez votre email
3. Cliquez sur "Continuer"

### Étape 3 : Type de site
Choisissez parmi : Vitrine, Portfolio, Blog, Boutique

### Étape 4 : Choisir un modèle
1. Parcourez la galerie de modèles
2. Cliquez sur celui qui vous plaît
3. Vous pourrez le personnaliser ensuite

### Étape 5 : Sections & Besoins
Cochez les sections souhaitées

### Terminé !
⚠️ **IMPORTANT** : Copiez et conservez votre **lien d'édition**.
C'est la seule façon de revenir modifier votre site !

---

## Modifier votre site

### Accéder à l'éditeur
Collez votre lien d'édition dans votre navigateur.

### La barre de paramétrage (à gauche)
Cliquez sur ☰ pour ouvrir les paramètres :

#### 📄 Pages & Menu
- Ajouter de nouvelles pages
- Réorganiser l'ordre du menu
- Supprimer des pages
- Définir la page d'accueil

#### 🎨 Design
- Changer de modèle (instantané !)
- Modifier les couleurs
- Changer les polices

#### 🖼️ Médiathèque
- Ajouter des images (glissez-les directement sur la page !)
- Gérer vos fichiers

### Modifier les textes
Cliquez directement sur n'importe quel texte pour le modifier.

### Ajouter des images
Glissez simplement vos images depuis votre ordinateur sur la page !

---

## Publier votre site

1. Cliquez sur "Publier" en haut à droite
2. Votre site est en ligne !
3. Partagez l'adresse avec vos visiteurs

---

## FAQ

### J'ai perdu mon lien d'édition
Malheureusement, sans ce lien, vous ne pouvez plus accéder à votre site.
Créez-en un nouveau.

### Comment ajouter une page ?
1. Ouvrez les paramètres (☰)
2. Allez dans "Pages & Menu"
3. Cliquez sur "Ajouter une page"

### Comment changer les couleurs ?
1. Ouvrez les paramètres (☰)
2. Allez dans "Design"
3. Modifiez les couleurs - elles changent en direct !
```

### API.md

```markdown
# API Documentation

## Sites

### Créer un site
\`POST /api/sites\`

### Récupérer par token
\`GET /api/sites/by-token?token=xxx\`

### Publier
\`POST /api/sites/{id}/publish\`

## Pages

### Lister
\`GET /api/sites/{id}/pages\`

### Créer
\`POST /api/sites/{id}/pages\`
Body: \`{ "title": "Ma page" }\`

### Modifier
\`PATCH /api/pages/{id}\`
Body: \`{ "title": "...", "order": 2, "showInMenu": true }\`

### Supprimer
\`DELETE /api/pages/{id}\`

## Thème

### Récupérer
\`GET /api/sites/{id}/theme\`

### Modifier (temps réel)
\`PATCH /api/sites/{id}/theme\`
Body: \`{ "primaryColor": "#FF0000", ... }\`

## Médias

### Lister
\`GET /api/sites/{id}/media\`

### Uploader
\`POST /api/sites/{id}/media\`
Content-Type: multipart/form-data

### Supprimer
\`DELETE /api/media/{id}\`
```

### CHANGELOG.md

```markdown
# Changelog

## [2.0.0] - 2026-02-02

### Ajouté
- Modale accordéon (420px) au lieu d'onglets
- Modifications temps réel (thème, couleurs, polices)
- Drag & drop d'images global
- Sites multipages avec navigation
- Onglets de navigation dans l'éditeur
- Preview du menu de navigation
- Agent INTEGRATOR pour Git

### Modifié
- Restructuration des prompts (1XX à 7XX)
- Amélioration UX de la modale

## [1.0.0] - 2026-01-30

### Ajouté
- Création de site sans compte
- Onboarding en 5 étapes
- Galerie de thèmes préenregistrés
- Éditeur visuel
- Publication en 1 clic
- Accès via lien secret
- Déploiement Docker + Caddy
```

---

## Versioning

### Convention

```
MAJOR.MINOR.PATCH

MAJOR : Changements breaking
MINOR : Nouvelles fonctionnalités
PATCH : Corrections de bugs
```

### Tags Git

```bash
# Créer un tag
git tag -a v2.0.0 -m "Version 2.0.0 - Modale accordéon + Temps réel"

# Pousser les tags
git push origin --tags
```

---

## Checklist de release

### Avant release

- [ ] Tous les tests passent
- [ ] Build Docker OK
- [ ] Documentation à jour
- [ ] CHANGELOG mis à jour
- [ ] Version incrémentée
- [ ] Tag Git créé

### Déploiement

- [ ] Pull sur le serveur
- [ ] Rebuild Docker
- [ ] Vérification santé
- [ ] Test rapide fonctionnel

### Après release

- [ ] Notification équipe
- [ ] Mise à jour du README si nécessaire
- [ ] Archivage des logs de release

---

## Livrables attendus

1. ✅ Dockerfile fonctionnel
2. ✅ docker-compose.yml
3. ✅ Caddyfile
4. ✅ README.md
5. ✅ DEPLOY_VPS.md
6. ✅ USER_GUIDE.md
7. ✅ API.md
8. ✅ CHANGELOG.md

---

*Dernière mise à jour : 25 février 2026*
