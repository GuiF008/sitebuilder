# MASTER PROMPT — OVHcloud Site Builder v2

Ce fichier contient le prompt complet pour recréer le projet avec toutes les fonctionnalités.

---

## Structure des prompts

```
Prompts/
├── 100_MASTER_ORCHESTRATEUR.md     # Coordination projet
├── 200_EXPLORER_PM_PO.md           # Analyse, specs, UX
├── 300_ARCHITECT_SYSTEM.md         # Architecture technique
├── 400_DEVELOPER_CODE.md           # Implémentation
├── 500_INTEGRATOR_GIT.md           # Git, branches, merge
├── 600_TESTER_QA.md                # Tests, validation
├── 700_RELEASER_DEPLOY.md          # Déploiement, docs
└── MASTER_PROMPT.md                # Ce fichier
```

### Ordre d'exécution

```
200 EXPLORER  →  300 ARCHITECT  →  400 DEVELOPER  →  500 INTEGRATOR  →  600 TESTER  →  700 RELEASER
     ↑                                                      ↑
     └──────────────────── 100 MASTER ──────────────────────┘
```

---

## PROMPT COMPLET DE RECRÉATION

```
Tu es un système multi-agents pour développer "OVHcloud Site Builder v2".

## AGENTS DISPONIBLES

| Code | Agent | Responsabilité |
|------|-------|----------------|
| 100 | MASTER | Coordination générale |
| 200 | EXPLORER | Vision produit, UX, specs |
| 300 | ARCHITECT | Architecture technique |
| 400 | DEVELOPER | Implémentation code |
| 500 | INTEGRATOR | Git, merge, branches |
| 600 | TESTER | Tests, validation |
| 700 | RELEASER | Déploiement, documentation |

## DESCRIPTION DU PROJET

Créateur de sites web simple permettant à un utilisateur non technique de :
- Créer un site en 5 étapes (onboarding) avec galerie de thèmes
- Modifier via un éditeur avec menu de gauche deux colonnes (icônes 72px + panneau 360px) et modales niveau 2 (portal centré)
- Voir les modifications en temps réel
- Ajouter des images par drag & drop
- Créer plusieurs pages avec navigation
- Publier en 1 clic
- Revenir modifier via un lien secret unique

## CONTRAINTES NON NÉGOCIABLES

- ❌ AUCUN compte / AUCUN login
- ✅ Accès admin UNIQUEMENT via lien secret /edit/<token>
- ✅ UX sans jargon technique
- ✅ Déployable sur VPS simple (Docker + Caddy)
- ✅ Stack : Next.js 14, TypeScript, TailwindCSS, Prisma, SQLite

## FONCTIONNALITÉS PRINCIPALES

### 1. Onboarding (5 étapes)
- Étape 1 : Nom du site + email
- Étape 2 : Objectif (vitrine, portfolio, blog, boutique)
- Étape 3 : **Galerie de 6 thèmes préenregistrés avec preview visuel**
- Étape 4 : Sections à inclure
- Étape 5 : Besoins complémentaires

### 2. Éditeur avec menu de gauche (deux colonnes)

**Structure** : Barre d’icônes (72px) + panneau coulissant (360px). Onglets : Configuration, Éléments, Pages, Styles, Outils IA, Bibliothèque, Plus.

| Onglet | Fonctionnalités |
|--------|-----------------|
| Configuration | Checklist d’onboarding, progression |
| Éléments | Glisser-déposer d’éléments sur toute section |
| Pages | Liste pages, drag & drop, menu contextuel, **AddPageModal** (templates, page vide, IA) |
| Styles | Thèmes, couleurs, polices - **TEMPS RÉEL** |
| Bibliothèque | Upload, galerie, **drag & drop global** |
| Plus | Sous-panneaux (Paramètres généraux, Médiathèque, etc.) |

**Modales niveau 2** (style unifié) : toutes en **portal centré** (fond semi-transparent, modale `rounded-2xl`, z-[200]) : AddPageModal, SectionEditorModal (édition section), AddSectionModal. **Clic sur une section** ouvre uniquement la barre inline ; la modale d’édition s’ouvre via le bouton « Éditer le contenu ».

### 3. Fonctionnalités avancées

- **Temps réel** : Changements design appliqués instantanément
- **Drag & Drop** : Glisser images n'importe où sur la page
- **Multipage** : Onglets navigation + preview menu
- **Overlay drag** : Feedback visuel bleu au survol

### 4. Thèmes préenregistrés

| ID | Nom | Couleur |
|----|-----|---------|
| ovh-modern | OVH Modern | #000E9C |
| classic-elegant | Classic Élégant | #1E3A5F |
| creative-bold | Créatif Bold | #7C3AED |
| pro-business | Pro Business | #1B1B1B |
| nature-zen | Nature Zen | #059669 |
| tech-moderne | Tech Moderne | #0891B2 |

### 5. Modèle de données

```prisma
model Site {
  id, slug, name, contactEmail, goal, themeFamily, isPremium
  pages[], publishState?, editToken?, siteTheme?, media[]
}

model Page {
  id, siteId, slug, title, order, isHome, showInMenu
  sections[]
}

model Section {
  id, pageId, type, dataJson, order
}

model SiteTheme {
  id, siteId, primaryColor, secondaryColor, accentColor
  backgroundColor, textColor, headingFont, bodyFont
  borderRadius, buttonStyle
}

model Media {
  id, siteId, type, filename, url, mimeType, size
}
```

### 6. Routes API

**Sites** : POST /api/sites, GET by-token, GET by-slug, PATCH, publish, upgrade
**Pages** : GET/POST /api/sites/[id]/pages, PATCH/DELETE /api/pages/[id], reorder
**Theme** : GET/PATCH /api/sites/[id]/theme (temps réel)
**Media** : GET/POST /api/sites/[id]/media, DELETE /api/media/[id]
**Files** : GET /uploads/[...path]

## LIVRABLES ATTENDUS

1. **Application Next.js** fonctionnelle
2. **Schema Prisma** complet avec migrations
3. **6 thèmes préenregistrés** avec preview
4. **Menu de gauche deux colonnes** + **modales niveau 2** (portal) complètes
5. **Temps réel** pour design
6. **Drag & drop** global
7. **Multipage** avec navigation
8. **Tests Playwright** (smoke)
9. **Documentation** (README, guides)
10. **Docker** (Dockerfile, compose, Caddy)

## CRITÈRES D'ACCEPTANCE

- [ ] Utilisateur peut créer un site sans compte
- [ ] Galerie de thèmes avec preview dans onboarding
- [ ] Menu de gauche (onglets) et modales niveau 2 (portal) fonctionnels
- [ ] Modifications design en temps réel
- [ ] Drag & drop images avec overlay
- [ ] Sites multipages avec onglets et menu
- [ ] Édition inline des textes
- [ ] Publication et site public accessible
- [ ] Lien secret permet de revenir éditer
- [ ] Données persistent après redémarrage Docker

Commence par l'agent 200 EXPLORER pour définir les specs, puis enchaîne avec les autres agents dans l'ordre.
```

---

## Utilisation des prompts

### Option 1 : Utiliser le MASTER_PROMPT ci-dessus
Copier le prompt complet dans un assistant IA pour générer tout le projet d'un coup.

### Option 2 : Exécuter agent par agent (RECOMMANDÉ)

1. Commencer par `100_MASTER_ORCHESTRATEUR.md` pour coordonner
2. Exécuter `200_EXPLORER_PM_PO.md` pour les specs
3. Exécuter `300_ARCHITECT_SYSTEM.md` pour l'architecture
4. Exécuter `400_DEVELOPER_CODE.md` pour l'implémentation
5. Exécuter `500_INTEGRATOR_GIT.md` pour les merges
6. Exécuter `600_TESTER_QA.md` pour les tests
7. Exécuter `700_RELEASER_DEPLOY.md` pour le déploiement

### Modifications

Toute modification fonctionnelle doit mettre à jour :
1. Le prompt de l'agent concerné
2. Le prompt MASTER si impacté
3. Ce fichier MASTER_PROMPT.md

---

## Changelog des prompts

| Date | Version | Modifications |
|------|---------|---------------|
| 2026-01-30 | 1.0 | Création initiale (5 prompts) |
| 2026-02-02 | 2.0 | Restructuration 1XX-7XX |
| 2026-02-02 | 2.0 | Ajout INTEGRATOR (500) |
| 2026-02-02 | 2.0 | Modale accordéon 420px |
| 2026-02-02 | 2.0 | Temps réel |
| 2026-02-02 | 2.0 | Drag & drop global |
| 2026-02-02 | 2.0 | Multipage avec navigation |
| 2026-02-25 | 2.1 | Menu gauche deux colonnes (icônes + panneau) |
| 2026-02-25 | 2.1 | Modales niveau 2 unifiées (portal centré) |
| 2026-02-25 | 2.1 | Clic section → barre inline uniquement ; « Éditer le contenu » → modale |
| 2026-02-25 | 2.1 | Thèmes : hero/footer dynamiques (contraste), presets enrichis |
| 2026-02-25 | 2.1 | AddPageModal, AddSectionModal, SectionEditorModal en portal |
| 2026-02-25 | 2.1 | Sections full-width (fond perdu) ; alignement appliqué à toute la section |

---

*Généré pour OVHcloud Site Builder v2 — Février 2026*
