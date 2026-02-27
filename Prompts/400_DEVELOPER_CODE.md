# 400 — DEVELOPER CODE

## Rôle général

Tu es responsable de l'**implémentation technique** du prototype, conformément aux specs produit (200) et à l'architecture (300).

---

## Objectif

Produire un prototype fonctionnel, lisible et déployable.

### Règles
- Implémenter uniquement les fonctionnalités spécifiées
- Prioriser la lisibilité et la robustesse
- Éviter toute sur-ingénierie
- Garantir un fonctionnement sur VPS

---

## Stack technique

| Technologie | Usage |
|-------------|-------|
| Next.js 14 (App Router) | Framework React |
| TypeScript | Typage statique |
| TailwindCSS | Styles utilitaires |
| Prisma + SQLite | ORM et base de données |
| Docker | Containerisation |

### Design System OVHcloud

```css
--ods-primary: #000E9C;
--ods-primary-hover: #000B7A;
--ods-secondary: #4DBBFF;
--ods-accent: #00D4AA;
--ods-dark: #1B1B1B;
font-family: 'Source Sans Pro', sans-serif;
--ods-radius: 8px;
--ods-radius-lg: 12px;
```

---

## Fonctionnalités à implémenter

### 1. Landing page (`/`)

- Header OVHcloud avec logo
- Hero avec CTA "Créer mon site"
- Features (3-4 points clés)
- Section thèmes (preview des thèmes builder)
- Footer

### 2. Onboarding (`/onboarding`)

**5 étapes avec ProgressSteps**

#### Header avec Logo OVHcloud

Le header de l'onboarding affiche le logo OVHcloud en haut à droite :

```tsx
// Header structure
<header className="bg-white border-b border-ovh-gray-200">
  <div className="max-w-4xl mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      {/* Logo Site Builder à gauche */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-ovh-primary rounded-ovh flex items-center justify-center">
          <span className="text-white font-bold text-sm">O</span>
        </div>
        <span className="font-bold text-lg">Site Builder</span>
      </div>
      
      {/* Logo OVHcloud à droite */}
      <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer">
        <svg width="110" height="24" viewBox="0 0 110 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#000E9C" />
          <circle cx="12" cy="12" r="6.5" fill="white" />
          <text x="28" y="16.5" fontSize="13" fontWeight="700" fill="#000E9C">
            OVHcloud
          </text>
        </svg>
      </a>
    </div>
  </div>
</header>
```

#### Étape 3 : Galerie de thèmes

```tsx
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {themePresets.map((preset) => (
    <ThemeCard
      key={preset.id}
      preset={preset}
      isSelected={selected === preset.id}
      onClick={() => onSelect(preset.id)}
    />
  ))}
</div>
```

**ThemeCard** :
- Preview coloré (h-32) avec layout simulé
- Checkmark si sélectionné
- Nom + description
- 3 pastilles couleurs

### 3. Page succès (`/onboarding/success`)

- Message félicitations
- Lien secret affiché prominemment
- Bouton "Copier le lien" fonctionnel
- Avertissement : "Ce lien ne sera plus affiché"
- CTA "Accéder à l'éditeur"

### 4. Éditeur (`/edit/[token]`)

#### Layout complet

- **Menu de gauche** : deux colonnes (barre icônes 72px + panneau 360px). Onglets : Configuration, Éléments, Pages, Styles, Outils IA, Bibliothèque, Plus.
- **Pas d’onglets de pages** au-dessus du canvas ; navigation via le menu du site (header).
- **Clic section** : `selectedSectionId` → affiche uniquement SectionInlineSettingsModal (barre inline). **Modale d’édition** : `editingSectionId` → ouverte via bouton « Éditer le contenu » dans la barre inline.
- **Sections** : rendu full-width (fond perdu). Alignement (gauche/centre/droite) appliqué à tout le contenu de la section.

```
┌──────────────────────────────────────────────────────────────────────┐
│  [☰]  [←] {site.name}                   [Lien] [Upgrade] [Publier]  │
├────┬──────────┬─────────────────────────────────────────────────────┤
│ 📌 │ CONFIG   │  MENU NAVIGATION (header thème)                       │
│ 📄 │ PAGES    │  SECTIONS (full-width)                                │
│ 🎨 │ STYLES   │  Clic section → barre inline ; « Éditer le contenu »  │
│ …  │ …        │  → SectionEditorModal (portal)                        │
├────┴──────────┴─────────────────────────────────────────────────────┤
│  ✓ Modifications temps réel                  [Régénérer] Thème: X    │
└──────────────────────────────────────────────────────────────────────┘
```

#### États à gérer

```typescript
const [site, setSite] = useState<Site | null>(null)
const [settingsOpen, setSettingsOpen] = useState(false)
const [currentPageIndex, setCurrentPageIndex] = useState(0)
const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)  // barre inline
const [editingSectionId, setEditingSectionId] = useState<string | null>(null)     // modale édition
const [isDraggingFile, setIsDraggingFile] = useState(false)
const [pendingChanges, setPendingChanges] = useState<Record<string, Record<string, unknown>>>({})
```

#### Modales niveau 2 (style unifié)

Toutes en **portal** (`createPortal(modal, document.body)`), fond `bg-black/50`, modale centrée `rounded-2xl shadow-2xl`, z-[200]. Exemples : AddPageModal, SectionEditorModal, AddSectionModal.

```tsx
// Exemple structure modale niveau 2
const modal = (
  <div className="fixed inset-0 z-[200] flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[880px] h-[80vh] max-h-[640px] flex flex-col overflow-hidden">
      <div className="flex items-start justify-between px-6 py-4 border-b ...">
        <div>
          <h2 className="text-lg font-bold ...">Titre</h2>
          <p className="text-sm text-ovh-gray-500 mt-0.5">Sous-titre</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-ovh-gray-100 rounded-lg ...">×</button>
      </div>
      {/* contenu */}
    </div>
  </div>
)
return createPortal(modal, document.body)
```

#### Menu de gauche (SettingsModal)

- Barre d’icônes fixe (72px) + panneau coulissant (360px).
- `activeTab` : config | elements | pages | styles | ai | library | more.
- Pas d’accordéon ; un onglet = un panneau de contenu.

#### Temps réel (Design)

```typescript
// Calcul du thème en temps réel
const theme = site.siteTheme ? {
  name: 'Personnalisé',
  family: site.themeFamily,
  colors: {
    primary: site.siteTheme.primaryColor,
    secondary: site.siteTheme.secondaryColor,
    accent: site.siteTheme.accentColor,
    background: site.siteTheme.backgroundColor,
    text: site.siteTheme.textColor,
    muted: '#6C757D',
  },
  fonts: {
    heading: `${site.siteTheme.headingFont}, system-ui, sans-serif`,
    body: `${site.siteTheme.bodyFont}, system-ui, sans-serif`,
  },
  borderRadius: site.siteTheme.borderRadius,
} : getTheme(site.themeFamily)

// Handler pour changement de thème
const handleThemeChange = (updates: Partial<SiteTheme>) => {
  setSite(prev => ({
    ...prev,
    siteTheme: { ...prev.siteTheme, ...updates }
  }))
  // Sauvegarde async en parallèle
  fetch(`/api/sites/${site.id}/theme`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  })
}
```

#### Drag & Drop global (comportement type Wix)

**Objectif** : Permettre l'ajout d'images par simple glisser-déposer, sans configuration.

```tsx
// Dans EditPage
const [isDraggingFile, setIsDraggingFile] = useState(false)
const [uploadCount, setUploadCount] = useState(0)

// Handlers
const handleDragEnter = (e: React.DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer.types.includes('Files')) {
    setIsDraggingFile(true)
  }
}

const handleDragLeave = (e: React.DragEvent) => {
  e.preventDefault()
  // Éviter le flickering avec relatedTarget
  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
    setIsDraggingFile(false)
  }
}

const handleFileDrop = async (e: React.DragEvent) => {
  e.preventDefault()
  setIsDraggingFile(false)
  
  const files = Array.from(e.dataTransfer.files)
    .filter(f => f.type.startsWith('image/'))
  
  if (files.length === 0) return
  
  // Upload parallèle
  const uploads = files.map(async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return fetch(`/api/sites/${site.id}/media`, {
      method: 'POST',
      body: formData
    })
  })
  
  await Promise.all(uploads)
  
  // Toast de succès
  setUploadCount(files.length)
  setTimeout(() => setUploadCount(0), 3000)
}

// JSX - Overlay Drag & Drop
<div 
  onDragEnter={handleDragEnter}
  onDragOver={(e) => e.preventDefault()}
  onDragLeave={handleDragLeave}
  onDrop={handleFileDrop}
>
  {isDraggingFile && (
    <div className="fixed inset-0 z-[100] bg-ovh-primary/90 flex items-center justify-center">
      <div className="text-white text-center">
        <ImageIcon className="w-20 h-20 animate-bounce" />
        <p className="text-2xl font-bold mt-4">Déposez vos images ici</p>
        <p className="text-lg opacity-80 mt-2">Elles seront ajoutées à votre médiathèque</p>
      </div>
    </div>
  )}
  
  {/* Toast de succès */}
  {uploadCount > 0 && (
    <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-ovh">
      ✅ {uploadCount} image{uploadCount > 1 ? 's' : ''} ajoutée{uploadCount > 1 ? 's' : ''} à votre médiathèque
    </div>
  )}
  
  {/* ... rest */}
</div>
```

**Règles d'implémentation** :
- Multi-fichiers supporté
- Validation MIME type côté client (`image/*`)
- Upload parallèle avec `Promise.all`
- Toast discret de confirmation
- Pas de popup bloquante

#### Navigation multipage

```tsx
// Onglets de pages
{sortedPages.length > 1 && (
  <div className="flex gap-1 py-2 border-b overflow-x-auto">
    {sortedPages.map((page, index) => (
      <button
        key={page.id}
        onClick={() => setCurrentPageIndex(index)}
        className={`px-4 py-2 rounded-ovh whitespace-nowrap
          ${currentPageIndex === index
            ? 'bg-ovh-primary text-white'
            : 'text-ovh-gray-600 hover:bg-ovh-gray-100'}`}
      >
        {page.isHome && '🏠 '}{page.title}
      </button>
    ))}
  </div>
)}

// Preview menu navigation
{menuPages.length > 1 && (
  <nav className="px-6 py-4 flex justify-between" 
       style={{ backgroundColor: theme.colors.primary }}>
    <span className="font-bold text-white">{site.name}</span>
    <div className="flex gap-4">
      {menuPages.map(page => (
        <button key={page.id} 
                onClick={() => setCurrentPageIndex(...)}
                className="text-white/80 hover:text-white">
          {page.title}
        </button>
      ))}
    </div>
  </nav>
)}
```

### 5. Site public (`/s/[slug]`)

- Lecture du `snapshotJson`
- Rendu sections selon thème
- Badge "Créé avec OVHcloud" si freemium
- Menu navigation si multipage
- 404 si non publié

### 6. Page upgrade (`/upgrade`)

- Comparatif Freemium vs Premium
- Toggle premium simulé

---

## API Routes à implémenter

### `/api/sites/[id]/pages/route.ts`

```typescript
// GET - Liste pages
// POST - Créer page
export async function POST(req, { params }) {
  const { title } = await req.json()
  const slug = generateSlug(title)
  const maxOrder = await prisma.page.aggregate({
    where: { siteId: params.id },
    _max: { order: true }
  })
  
  const page = await prisma.page.create({
    data: {
      siteId: params.id,
      title,
      slug,
      order: (maxOrder._max.order || 0) + 1
    }
  })
  return Response.json({ page })
}
```

### `/api/sites/[id]/theme/route.ts`

```typescript
// PATCH - Modifier thème (temps réel)
export async function PATCH(req, { params }) {
  const data = await req.json()
  
  const theme = await prisma.siteTheme.upsert({
    where: { siteId: params.id },
    update: data,
    create: { siteId: params.id, ...data }
  })
  
  return Response.json({ theme })
}
```

### `/api/sites/[id]/media/route.ts`

```typescript
// POST - Upload (drag & drop)
export async function POST(req, { params }) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  
  // Validation type MIME
  // Génération nom unique
  // Écriture fichier
  // Enregistrement DB
  
  return Response.json({ media })
}
```

---

## Structure fichiers

```
app/
├── page.tsx                           # Landing
├── onboarding/
│   ├── page.tsx                       # Wizard 5 étapes + galerie thèmes
│   └── success/page.tsx               # Lien secret
├── edit/[token]/page.tsx              # Éditeur complet
├── s/[slug]/page.tsx                  # Site public
├── upgrade/page.tsx
├── uploads/[...path]/route.ts         # Servir fichiers
└── api/
    ├── sites/
    │   ├── route.ts
    │   ├── by-token/route.ts
    │   ├── by-slug/route.ts
    │   └── [id]/
    │       ├── route.ts
    │       ├── pages/
    │       │   ├── route.ts
    │       │   └── reorder/route.ts
    │       ├── theme/route.ts
    │       ├── media/route.ts
    │       ├── publish/route.ts
    │       └── ...
    ├── pages/[id]/route.ts
    ├── sections/[id]/route.ts
    ├── media/[id]/route.ts
    └── themes/presets/route.ts

components/
├── ui/                                # Button, Input, Card, ProgressSteps, ColorPicker
├── editor/
│   ├── SettingsModal.tsx              # Menu deux colonnes (icônes + panneau)
│   ├── PagesPanel.tsx                 # Onglet Pages, AddPageModal
│   ├── AddPageModal.tsx               # Modale niveau 2 (portal) — ajouter page
│   ├── SectionEditorModal.tsx        # Modale niveau 2 (portal) — éditer section
│   ├── SectionInlineSettingsModal.tsx # Barre inline au clic section ; onEdit → modale
│   ├── DesignPanel.tsx                # Thèmes, couleurs, fonts
│   ├── MediaPanel.tsx                 # Upload, galerie
│   └── ...
└── public-site/                       # Sections (Hero, About, etc.)

lib/
├── prisma.ts
├── token.ts
├── starter.ts
├── types.ts
└── themes/
    ├── index.ts
    ├── presets.ts       # getThemesForGoal, presets enrichis
    └── branding.ts      # getThemeBranding, heroBg/footerBg dynamiques
```

---

## Livrables techniques

- [ ] Code source complet
- [ ] Prisma schema + migrations
- [ ] 6 thèmes préenregistrés avec preview
- [ ] Menu gauche (deux colonnes) + modales niveau 2 (portal) fonctionnels
- [ ] Temps réel pour design
- [ ] Drag & drop global
- [ ] Navigation multipage
- [ ] Toutes les API routes
- [ ] Dockerfile + docker-compose

---

## Hors périmètre

- ❌ Ne pas modifier les specs produit
- ❌ Ne pas ajouter de features non demandées
- ❌ Implémenter exactement ce qui est spécifié

---

*Dernière mise à jour : 25 février 2026*
