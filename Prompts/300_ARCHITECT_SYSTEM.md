# 300 — ARCHITECT SYSTEM

## Rôle général

Tu es responsable de la **structure technique globale** du prototype, en garantissant simplicité, cohérence et faisabilité.

---

## Objectif d'architecture

Définir une architecture claire, compréhensible et adaptée à un prototype déployé sur un VPS.

### Tâches
- Traduire les besoins produit en structure technique
- Favoriser une architecture monolithique simple
- Limiter les dépendances et composants
- Anticiper les contraintes de déploiement VPS

---

## Stack imposée

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

## Architecture globale

### Schéma

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

## Modèle de données Prisma

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

## Thèmes préenregistrés

### Structure (`lib/themes/presets.ts`)

```typescript
interface ThemePreset {
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
  fonts: { heading: string; body: string }
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

## API Routes

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

### Media (Drag & Drop — comportement type Wix)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/sites/[id]/media` | Lister médias |
| POST | `/api/sites/[id]/media` | Upload (multipart) |
| DELETE | `/api/media/[id]` | Supprimer |
| GET | `/uploads/[...path]` | Servir fichiers |

#### Spécifications Drag & Drop

**Déclencheur** : L'utilisateur glisse un fichier image sur la zone d'édition

**Comportement UX** :
1. `dragenter` → Overlay bleu semi-transparent sur toute la zone
2. Message : "Déposez vos images ici"
3. Sous-message : "Elles seront ajoutées à votre médiathèque"
4. Animation : Icône image avec effet bounce
5. `drop` → Upload automatique en arrière-plan

**Feedback** : Toast "X images ajoutées à votre médiathèque"

**Règles techniques** :
- Multi-fichiers supporté
- Validation MIME type côté client
- Upload parallèle si plusieurs fichiers
- Pas de popup bloquante

---

## Structure des composants

### Composant Logo OVHcloud (Header Onboarding)

Le header de l'onboarding doit afficher le logo OVHcloud en haut à droite, conforme à la charte graphique officielle.

```
┌────────────────────────────────────────────────────────────────────┐
│  [O] Site Builder                              [Logo OVHcloud →]   │
│                                                 (cliquable)        │
└────────────────────────────────────────────────────────────────────┘
```

**Spécifications techniques** :
- **Composant** : SVG inline (pas de dépendance externe)
- **Dimensions** : `width="110" height="24"`
- **Couleur principale** : `#000E9C` (bleu OVHcloud)
- **Structure** : Cercle bleu + cercle blanc intérieur + texte "OVHcloud"
- **Lien** : `https://www.ovhcloud.com` (target="_blank")
- **Référence** : https://zeroheight.com/6fc8a63f7/p/394306-welcome-to-the-brand-hub

### Menu de gauche et modales niveau 2

```
components/editor/
├── SettingsModal.tsx           # Menu deux colonnes (icônes 72px + panneau 360px)
├── PagesPanel.tsx               # Onglet Pages (liste, drag, menu contextuel, AddPageModal)
├── AddPageModal.tsx             # Modale niveau 2 (portal) — ajouter une page
├── SectionEditorModal.tsx       # Modale niveau 2 (portal) — éditer contenu section
├── SectionInlineSettingsModal.tsx # Barre inline au clic sur une section ; bouton « Éditer le contenu »
├── DesignPanel.tsx              # Onglet Styles (temps réel)
├── MediaPanel.tsx               # Onglet Bibliothèque
└── ...
```

**Thèmes** : `lib/themes/branding.ts` — `getThemeBranding()` dérive `heroBg` et `footerBg` du fond du site (contraste). Presets enrichis et `getThemesForGoal(goal)` dans `presets.ts`.

### État pour temps réel

```typescript
// Dans l'éditeur, le thème est calculé dynamiquement
const theme = site.siteTheme ? {
  colors: {
    primary: site.siteTheme.primaryColor,
    secondary: site.siteTheme.secondaryColor,
    accent: site.siteTheme.accentColor,
    // ...
  },
  // ...
} : getTheme(site.themeFamily)
```

---

## Gestion des accès

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

## Publication (Snapshot)

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

## Hors périmètre

- ❌ Aucun code d'implémentation
- ❌ Aucune UX ou design
- ❌ Aucune décision produit

---

## Livrables attendus

1. ✅ Schéma d'architecture
2. ✅ Modèle Prisma complet (avec Page multipage, SiteTheme, Media)
3. ✅ Structure thèmes préenregistrés
4. ✅ Routes API (pages, theme, media)
5. ✅ Structure composants (menu gauche + modales niveau 2 portal)
6. ✅ Mécanisme publication
7. ✅ Branding thème (hero/footer dynamiques)

---

*Dernière mise à jour : 25 février 2026*
