# PROJECT BRIEF — OVHcloud Site Builder v2

## Vision
Créateur de sites web simple permettant à un utilisateur **non technique** de créer, modifier et publier un site web en quelques minutes, **sans aucun compte ni inscription**.

---

## Proposition de valeur
> "Créez votre site en 5 minutes, sans connaissance technique, sans compte à créer."

---

## Fonctionnalités clés

| # | Fonctionnalité | Description |
|---|----------------|-------------|
| 1 | **Onboarding 5 étapes** | Parcours guidé avec galerie de 6 thèmes préenregistrés |
| 2 | **Éditeur avec modale accordéon** | Interface 420px avec 3 sections (Pages, Design, Médias) |
| 3 | **Temps réel** | Modifications de design appliquées instantanément |
| 4 | **Drag & Drop** | Upload d'images par glisser-déposer n'importe où |
| 5 | **Sites multipages** | Navigation avec onglets et menu automatique |
| 6 | **Publication 1 clic** | Site accessible sur `/s/<slug>` |
| 7 | **Accès via lien secret** | Édition uniquement via `/edit/<token>` |

---

## Contraintes non négociables

- ❌ **AUCUN login** / mot de passe / compte utilisateur
- ✅ Accès admin **uniquement via lien secret**
- ✅ UX sans jargon technique
- ✅ Déployable sur **VPS simple** (Docker + Caddy)
- ✅ Persistance des données après redémarrage

---

## Stack technique imposée

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 14 (App Router) |
| Langage | TypeScript |
| Styles | TailwindCSS |
| ORM | Prisma |
| Base de données | SQLite |
| Containerisation | Docker |
| Reverse proxy | Caddy |

---

## Persona cible

**Marie Dupont** — Commerçante/artisan, 25-55 ans
- Niveau technique : très faible
- Peurs : faire une erreur, perdre son travail
- Attentes : simplicité, guidage, résultats rapides

---

## Thèmes préenregistrés (6)

| ID | Nom | Couleur primaire |
|----|-----|------------------|
| ovh-modern | OVH Modern | #000E9C |
| classic-elegant | Classic Élégant | #1E3A5F |
| creative-bold | Créatif Bold | #7C3AED |
| pro-business | Pro Business | #1B1B1B |
| nature-zen | Nature Zen | #059669 |
| tech-moderne | Tech Moderne | #0891B2 |

---

## Livrables attendus

1. `PRODUCT_SPEC.md` — Spécifications produit (PM/PO)
2. `ARCHITECTURE.md` — Architecture technique (Architecte)
3. **Prototype fonctionnel** — Application Next.js complète
4. `QA_CHECKLIST.md` — Tests et validation (QA)
5. `README.md` + `DEPLOY_VPS.md` + `FAQ.md` — Documentation

---

## Critères d'acceptance finaux

- [ ] Utilisateur peut créer un site sans compte
- [ ] Galerie de thèmes avec preview dans onboarding
- [ ] Modale accordéon fonctionnelle (3 sections)
- [ ] Modifications design en temps réel
- [ ] Drag & drop images avec overlay
- [ ] Sites multipages avec onglets et menu
- [ ] Publication et site public accessible
- [ ] Lien secret permet de revenir éditer
- [ ] Données persistent après redémarrage Docker

---

*Généré le 3 février 2026 — Agent MASTER (100)*
