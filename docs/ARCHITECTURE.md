# ARCHITECTURE.md — Architecture Technique OVHcloud Site Builder v2

> **Agent** : 300 ARCHITECT SYSTEM  
> **Version** : 2.0  
> **Date** : 3 février 2026

---

## 1. Vue d'ensemble

### Schéma d'architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    CADDY (Reverse Proxy)                     │
│              sitebuilder.domain.com → :3000                  │
│                       + SSL automatique                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      DOCKER CONTAINER                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    NEXT.JS APP                          │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                         │ │
│  │  PAGES (SSR/CSR)              API ROUTES               │ │
│  │  ├── /                        ├── /api/sites           │ │
│  │  ├── /onboarding              ├── /api/sites/[id]/*    │ │
│  │  ├── /edit/[token]            ├── /api/pages/[id]      │ │
│  │  ├── /s/[slug]                ├── /api/sections/[id]   │ │
│  │  └── /upgrade                 ├── /api/media/[id]      │ │
│  │                               └── /api/themes/presets  │ │
│  │                                                         │ │
│  │  COMPONENTS                    LIBS                    │ │
│  │  ├── ui/                       ├── prisma.ts           │ │
│  │  ├── editor/                   ├── token.ts            │ │
│  │  │   ├── SettingsModal.tsx     ├── themes/             │ │
│  │  │   ├── PagesPanel.tsx        │   ├── index.ts        │ │
│  │  │   ├── DesignPanel.tsx       │   └── presets.ts      │ │
│  │  │   └── MediaPanel.tsx        └── starter.ts          │ │
│  │  └── public-site/                                      │ │
│  │                                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    PRISMA ORM                           │ │
│  └───────────────────────┬────────────────────────────────┘ │
│                          │                                   │
│  ┌───────────────────────┴────────────────────────────────┐ │
│  │  SQLITE DB              UPLOADS (Filesystem)            │ │
│  │  /data/sitebuilder.db   /data/uploads/{siteId}/         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | Next.js (App Router) | 14.x |
| Langage | TypeScript | 5.x |
| Styles | TailwindCSS | 3.x |
| ORM | Prisma | 6.x |
| Base de données | SQLite | - |
| Containerisation | Docker | - |
| Reverse proxy | Caddy | - |

---

## 3. Modèle de données Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ============================================
// SITE
// ============================================
model Site {
  id           String   @id @default(uuid())
  slug         String   @unique
  name         String
  contactEmail String
  goal         String   // vitrine | portfolio | blog | ecommerce
  themeFamily  String   // ID thème préenregistré
  isPremium    Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  pages        Page[]
  publishState PublishState?
  editToken    EditToken?
  siteTheme    SiteTheme?
  media        Media[]
}

// ============================================
// PAGE (MULTIPAGE)
// ============================================
model Page {
  id         String    @id @default(uuid())
  siteId     String
  slug       String
  title      String
  order      Int       @default(0)
  isHome     Boolean   @default(false)
  showInMenu Boolean   @default(true)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  
  site       Site      @relation(fields: [siteId], references: [id], onDelete: Cascade)
  sections   Section[]

  @@unique([siteId, slug])
}

// ============================================
// SECTION
// ============================================
model Section {
  id       String @id @default(uuid())
  pageId   String
  type     String // hero | about | services | gallery | testimonials | contact | footer | hours
  dataJson String // JSON content
  order    Int    @default(0)

  page     Page   @relation(fields: [pageId], references: [id], onDelete: Cascade)
}

// ============================================
// SITE THEME (Personnalisation, temps réel)
// ============================================
model SiteTheme {
  id              String @id @default(uuid())
  siteId          String @unique
  primaryColor    String @default("#000E9C")
  secondaryColor  String @default("#0050D7")
  accentColor     String @default("#00D4AA")
  backgroundColor String @default("#FFFFFF")
  textColor       String @default("#212529")
  headingFont     String @default("Source Sans Pro")
  bodyFont        String @default("Source Sans Pro")
  borderRadius    String @default("8px")
  buttonStyle     String @default("rounded")

  site            Site   @relation(fields: [siteId], references: [id], onDelete: Cascade)
}

// ============================================
// PUBLISH STATE
// ============================================
model PublishState {
  id           String    @id @default(uuid())
  siteId       String    @unique
  isPublished  Boolean   @default(false)
  publishedAt  DateTime?
  snapshotJson String?

  site         Site      @relation(fields: [siteId], references: [id], onDelete: Cascade)
}

// ============================================
// EDIT TOKEN (Lien secret)
// ============================================
model EditToken {
  id         String    @id @default(uuid())
  siteId     String    @unique
  tokenHash  String    // SHA-256
  createdAt  DateTime  @default(now())
  lastUsedAt DateTime?

  site       Site      @relation(fields: [siteId], references: [id], onDelete: Cascade)
}

// ============================================
// MEDIA (Drag & Drop)
// ============================================
model Media {
  id        String   @id @default(uuid())
  siteId    String
  type      String   // image | video | audio
  filename  String
  url       String
  mimeType  String?
  size      Int?
  createdAt DateTime @default(now())

  site      Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
}
```

---

## 4. Thèmes préenregistrés

### Structure TypeScript

```typescript
// lib/themes/presets.ts

export interface ThemePreset {
  id: string
  name: string
  description: string
  preview: string
  category: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    muted: string
  }
  fonts: { 
    heading: string
    body: string 
  }
  borderRadius: string
  buttonStyle: 'rounded' | 'square' | 'pill'
  defaultSections: string[]
}
```

### Liste des 6 thèmes

| ID | Nom | Primary | Category |
|----|-----|---------|----------|
| `ovh-modern` | OVH Modern | #000E9C | professional |
| `classic-elegant` | Classic Élégant | #1E3A5F | professional |
| `creative-bold` | Créatif Bold | #7C3AED | creative |
| `pro-business` | Pro Business | #1B1B1B | professional |
| `nature-zen` | Nature Zen | #059669 | minimal |
| `tech-moderne` | Tech Moderne | #0891B2 | bold |

---

## 5. API Routes

### Sites

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/sites` | Créer un site |
| GET | `/api/sites/by-token?token=xxx` | Récupérer par token |
| GET | `/api/sites/by-slug?slug=xxx` | Récupérer publié |
| PATCH | `/api/sites/[id]` | Modifier site |
| POST | `/api/sites/[id]/publish` | Publier |
| POST | `/api/sites/[id]/upgrade` | Toggle premium |
| POST | `/api/sites/[id]/regenerate-token` | Nouveau token |

### Pages (Multipage)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/sites/[id]/pages` | Lister pages |
| POST | `/api/sites/[id]/pages` | Créer page |
| PATCH | `/api/sites/[id]/pages/reorder` | Réordonner |
| PATCH | `/api/pages/[id]` | Modifier page |
| DELETE | `/api/pages/[id]` | Supprimer page |

### Sections

| Méthode | Route | Description |
|---------|-------|-------------|
| PATCH | `/api/sections/[id]` | Modifier section |

### Thème (Temps réel)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/themes/presets` | Liste présets |
| GET | `/api/sites/[id]/theme` | Thème actuel |
| PATCH | `/api/sites/[id]/theme` | Modifier thème |

### Media (Drag & Drop)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/sites/[id]/media` | Lister médias |
| POST | `/api/sites/[id]/media` | Upload (multipart) |
| DELETE | `/api/media/[id]` | Supprimer |
| GET | `/uploads/[...path]` | Servir fichiers |

---

## 6. Structure des composants

### Éditeur - Modale accordéon

```
components/editor/
├── SettingsModal.tsx      # Container accordéon 420px
├── PagesPanel.tsx         # Section Pages & Menu
├── DesignPanel.tsx        # Section Design (temps réel)
└── MediaPanel.tsx         # Section Médiathèque
```

### Composants UI

```
components/ui/
├── Button.tsx
├── Input.tsx
├── Card.tsx
├── ProgressSteps.tsx
├── ColorPicker.tsx
└── AccordionSection.tsx
```

### Site public

```
components/public-site/
├── HeroSection.tsx
├── AboutSection.tsx
├── ServicesSection.tsx
├── GallerySection.tsx
├── TestimonialsSection.tsx
├── ContactSection.tsx
├── FooterSection.tsx
└── NavigationMenu.tsx
```

---

## 7. Gestion des accès

### Token d'édition

1. **Génération** : `crypto.randomBytes(32).toString('hex')` = 64 caractères
2. **Stockage** : SHA-256 du token en base
3. **Vérification** : Hash du token fourni vs stocké
4. **Régénération** : Invalide ancien, génère nouveau

### Sécurité uploads

- Types MIME autorisés : `image/*`, `video/*`, `audio/*`
- Taille max : 10 MB (images), 50 MB (vidéos)
- Nom fichier : UUID + extension originale
- Stockage : `/uploads/{siteId}/`

---

## 8. Publication (Snapshot)

### Mécanisme

1. **Snapshot JSON** : Pages + sections + thème sérialisés
2. **Stockage** : `snapshotJson` dans `PublishState`
3. **Rendu public** : Lit le snapshot, pas les données live
4. **Republication** : Nouveau snapshot

### Draft vs Publié

| Aspect | Draft | Publié |
|--------|-------|--------|
| Source | Tables Prisma | snapshotJson |
| Accès | Token requis | Public |
| Modifications | Live | Figé |
| URL | `/edit/[token]` | `/s/[slug]` |

---

## 9. Structure fichiers complète

```
sitebuilder/
├── app/
│   ├── page.tsx                           # Landing
│   ├── layout.tsx
│   ├── globals.css
│   ├── onboarding/
│   │   ├── page.tsx                       # Wizard 5 étapes + galerie thèmes
│   │   └── success/page.tsx               # Lien secret
│   ├── edit/[token]/page.tsx              # Éditeur complet
│   ├── s/[slug]/page.tsx                  # Site public
│   ├── upgrade/page.tsx
│   ├── uploads/[...path]/route.ts         # Servir fichiers
│   └── api/
│       ├── health/route.ts
│       ├── sites/
│       │   ├── route.ts
│       │   ├── by-token/route.ts
│       │   ├── by-slug/route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       ├── pages/
│       │       │   ├── route.ts
│       │       │   └── reorder/route.ts
│       │       ├── theme/route.ts
│       │       ├── media/route.ts
│       │       ├── publish/route.ts
│       │       ├── upgrade/route.ts
│       │       └── regenerate-token/route.ts
│       ├── pages/[id]/route.ts
│       ├── sections/[id]/route.ts
│       ├── media/[id]/route.ts
│       └── themes/presets/route.ts
├── components/
│   ├── ui/
│   ├── editor/
│   └── public-site/
├── lib/
│   ├── prisma.ts
│   ├── token.ts
│   ├── starter.ts
│   ├── types.ts
│   └── themes/
│       ├── index.ts
│       └── presets.ts
├── prisma/
│   └── schema.prisma
├── public/
├── docs/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 10. Variables d'environnement

```env
# .env
DATABASE_URL="file:./data/sitebuilder.db"
NODE_ENV="development"
```

```env
# .env.production
DATABASE_URL="file:/app/data/sitebuilder.db"
NODE_ENV="production"
```

---

*Document généré par Agent 300 ARCHITECT SYSTEM — 3 février 2026*
