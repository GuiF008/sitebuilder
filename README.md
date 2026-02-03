# OVHcloud Site Builder v2

Créateur de sites web simple, sans compte requis.

## Fonctionnalités

- ✅ Création sans inscription
- ✅ Onboarding 5 étapes avec galerie de 6 thèmes
- ✅ Éditeur avec modale accordéon (420px)
- ✅ Modifications design en temps réel
- ✅ Drag & drop d'images
- ✅ Sites multipages avec navigation
- ✅ Publication en 1 clic
- ✅ Accès via lien secret unique

## Stack technique

| Technologie | Version |
|-------------|---------|
| Next.js (App Router) | 14.x |
| TypeScript | 5.x |
| TailwindCSS | 3.x |
| Prisma | 6.x |
| SQLite | - |
| Docker | - |

## Installation locale

```bash
# Cloner le repo
git clone <repo-url>
cd sitebuilder

# Installer les dépendances
npm install

# Configurer l'environnement
echo 'DATABASE_URL="file:./data/sitebuilder.db"' > .env

# Créer la base de données
npx prisma db push

# Lancer le serveur de développement
npm run dev
```

→ Ouvrir http://localhost:3000

## Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Vérification ESLint |
| `npm run db:push` | Synchroniser le schéma Prisma |
| `npm run db:studio` | Interface Prisma Studio |

## Déploiement Docker

```bash
# Build et lancement
docker compose up -d --build

# Logs
docker compose logs -f app

# Arrêt
docker compose down
```

## Structure du projet

```
sitebuilder/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Landing page
│   ├── onboarding/        # Tunnel de création
│   ├── edit/[token]/      # Éditeur
│   ├── s/[slug]/          # Site public
│   └── api/               # API Routes
├── components/            # Composants React
│   ├── ui/               # Composants UI de base
│   └── editor/           # Composants de l'éditeur
├── lib/                   # Utilitaires et configuration
│   ├── prisma.ts         # Client Prisma
│   ├── token.ts          # Gestion des tokens
│   └── themes/           # Thèmes préenregistrés
├── prisma/               # Schéma de base de données
├── docs/                 # Documentation
├── Dockerfile            # Container Docker
└── docker-compose.yml    # Configuration Docker Compose
```

## Documentation

- [Spécifications produit](./docs/PRODUCT_SPEC.md)
- [Architecture technique](./docs/ARCHITECTURE.md)
- [Guide de déploiement VPS](./docs/DEPLOY_VPS.md)

## Thèmes disponibles

| ID | Nom | Couleur primaire |
|----|-----|------------------|
| ovh-modern | OVH Modern | #000E9C |
| classic-elegant | Classic Élégant | #1E3A5F |
| creative-bold | Créatif Bold | #7C3AED |
| pro-business | Pro Business | #1B1B1B |
| nature-zen | Nature Zen | #059669 |
| tech-moderne | Tech Moderne | #0891B2 |

## Contraintes

- ❌ Aucun login / compte utilisateur
- ✅ Accès admin uniquement via lien secret
- ✅ Déployable sur VPS simple (Docker + Caddy)

## Licence

Projet OVHcloud — Février 2026
