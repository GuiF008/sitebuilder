# PRODUCT_SPEC.md — Spécifications Produit OVHcloud Site Builder v2

> **Agent** : 200 EXPLORER PM/PO  
> **Version** : 2.0  
> **Date** : 3 février 2026

---

## 1. Proposition de valeur

### Vision produit
Permettre à un utilisateur non technique de créer, personnaliser et publier un site web professionnel en moins de 10 minutes, sans aucune inscription ni connaissance technique.

### Promesse
> "Votre site en ligne en 5 étapes, sans compte à créer."

---

## 2. Persona cible

### Marie Dupont — Utilisatrice type

| Attribut | Valeur |
|----------|--------|
| Âge | 25-55 ans |
| Métier | Commerçante, artisan, profession libérale, association |
| Niveau technique | Très faible |
| Objectif | Avoir un site web pour son activité |
| Peurs | Faire une bêtise, perdre son travail, ne pas comprendre |
| Attentes | Simplicité, guidage, résultats rapides, évolutif |

### Vocabulaire adapté

| ❌ À éviter | ✅ À utiliser |
|-------------|---------------|
| Domaine | Adresse du site |
| Hébergement | Votre site en ligne |
| Template | Modèle de site |
| CMS | Créateur de site |
| Deploy | Mettre en ligne |
| Token | Lien secret |
| Drag & drop | Glisser-déposer |

---

## 3. Parcours utilisateur

```
Landing (/)
    ↓
Onboarding (/onboarding) — 5 étapes
    ↓
Succès (/onboarding/success) — Lien secret affiché
    ↓
Éditeur (/edit/<token>) — Modale accordéon + multipage
    ↓
Publication
    ↓
Site public (/s/<slug>) — Menu navigation si multipage
```

---

## 4. Spécifications fonctionnelles

### 4.1 Onboarding (5 étapes)

#### Étape 1 : Identité
- **Champs** : Nom du site, email de contact
- **Message** : "Donnez un nom à votre site. Vous pourrez le changer plus tard."
- **Validation** : Champs requis, email valide

#### Étape 2 : Objectif
- **Options** (cartes cliquables) :
  - 🏢 Vitrine — Présenter mon activité
  - 🖼️ Portfolio — Montrer mes créations
  - 📝 Blog — Partager mes actualités
  - 🛒 Boutique — Vendre en ligne
- **Message** : "À quoi servira votre site ?"

#### Étape 3 : Thèmes préenregistrés (GALERIE)
- **Affichage** : Grille de 6 thèmes avec preview visuel
- **Message** : "Choisissez un modèle. Vous pourrez le personnaliser ensuite."

| ID | Nom | Description | Couleur | Adapté pour |
|----|-----|-------------|---------|-------------|
| `ovh-modern` | OVH Modern | Design épuré OVHcloud | #000E9C | Tous |
| `classic-elegant` | Classic Élégant | Traditionnel, raffiné | #1E3A5F | Services |
| `creative-bold` | Créatif Bold | Dynamique, coloré | #7C3AED | Portfolio |
| `pro-business` | Pro Business | Sobre, corporate | #1B1B1B | B2B |
| `nature-zen` | Nature Zen | Organique, apaisant | #059669 | Bien-être |
| `tech-moderne` | Tech Moderne | Futuriste, innovant | #0891B2 | Startups |

**Chaque thème affiche** :
- Preview visuel avec simulation de layout
- Palette de 3 couleurs (pastilles)
- Indicateur de sélection (checkmark)

#### Étape 4 : Contenu
- **Options** (checkboxes multiples) :
  - ✅ À propos
  - ✅ Services
  - ⬜ Galerie photos
  - ⬜ Témoignages clients
  - ✅ Contact
  - ⬜ Horaires & localisation
- **Message** : "Que souhaitez-vous montrer sur votre site ?"

#### Étape 5 : Besoins complémentaires
- **Options** : Formulaire contact, Visible Google, Chat, RDV, Vendre
- **Message** : "Avez-vous des besoins particuliers ?"
- **Note** : Certaines fonctionnalités = Premium (informatif)

---

### 4.2 Éditeur avec modale accordéon

#### Layout général

```
┌──────────────────────────────────────────────────────────────────────┐
│  [☰]  [←] Mon Site                          [Lien] [Upgrade] [Publier]│
├─────────────────────┬────────────────────────────────────────────────┤
│                     │  [Page 1] [Page 2] [Page 3]  ← Onglets pages   │
│  MODALE PARAMÈTRES  ├────────────────────────────────────────────────┤
│  (420px, accordéon) │  ┌──────────────────────────────────────────┐  │
│                     │  │     MENU NAVIGATION (preview si >1 page) │  │
│  ▼ 📄 Pages & Menu  │  └──────────────────────────────────────────┘  │
│    [contenu...]     │                                                │
│                     │           ZONE D'ÉDITION VISUELLE             │
│  ▶ 🎨 Design        │                                                │
│                     │     (clic = éditer, glisser = upload image)   │
│  ▶ 🖼️ Médiathèque   │                                                │
│                     │                                                │
├─────────────────────┴────────────────────────────────────────────────┤
│  ✓ Modifications en temps réel           [Régénérer lien] Thème: X   │
└──────────────────────────────────────────────────────────────────────┘
```

#### Structure modale accordéon (420px)

```
┌────────────────────────────────────────────────────────────────┐
│  Paramètres du site                                    [✕]    │
│  Personnalisez votre site                                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ▼ 📄 Pages & Menu          (section ouverte = bordure bleue) │
│     Gérer les pages et la navigation                           │
│     ┌────────────────────────────────────────────────────┐     │
│     │ Liste des pages avec réordonnement                  │     │
│     │ [+ Ajouter une page]                               │     │
│     │ Chaque page : titre, 🏠 home, 👁️ menu, 🗑️ suppr    │     │
│     └────────────────────────────────────────────────────┘     │
│                                                                │
│  ▶ 🎨 Design du site        (section fermée)                  │
│     Couleurs, polices et styles                                │
│                                                                │
│  ▶ 🖼️ Médiathèque           (section fermée)                  │
│     Images, vidéos et fichiers                                 │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  Les modifications sont appliquées en temps réel               │
└────────────────────────────────────────────────────────────────┘
```

#### Section 📄 Pages & Menu

| Fonction | Description | UX |
|----------|-------------|-----|
| Liste des pages | Toutes les pages du site | Liste verticale |
| Réordonner | Changer l'ordre | Flèches haut/bas |
| Créer une page | Nouvelle page | Bouton + input titre |
| Renommer | Modifier le titre | Clic sur le nom |
| Supprimer | Retirer (avec confirmation) | Icône poubelle |
| Page d'accueil | Définir home | Icône 🏠 |
| Menu visibility | Afficher/masquer | Icône 👁️ |

#### Section 🎨 Design

| Sous-section | Options |
|--------------|---------|
| **Modèles** | Grille des 6 thèmes préenregistrés |
| **Couleurs** | 5 color pickers (primary, secondary, accent, bg, text) |
| **Polices** | 2 sélecteurs (titres, texte) |
| **Boutons** | Style (square/rounded/pill) |

**IMPORTANT** : Toutes les modifications sont **temps réel** (pas de bouton Sauvegarder)

#### Section 🖼️ Médiathèque

| Fonction | Description |
|----------|-------------|
| Zone upload | Drag & drop ou bouton parcourir |
| Filtres | Tous / Images / Vidéos / Sons |
| Galerie | Grille avec preview |
| Actions | Copier URL, Supprimer |

---

### 4.3 Drag & Drop global

L'utilisateur peut glisser des images depuis son ordinateur **n'importe où** sur la zone d'édition.

#### Comportement
1. **Survol avec fichier** : Overlay bleu couvrant l'écran
2. **Message** : "Déposez vos images ici"
3. **Sous-message** : "Elles seront ajoutées à votre médiathèque"
4. **Animation** : Icône image qui bounce
5. **Drop** : Upload automatique, notification succès

---

### 4.4 Sites multipages

#### Navigation dans l'éditeur
- **Onglets** en haut de la zone d'édition
- Chaque page = un onglet cliquable
- Page active = fond coloré
- Icône 🏠 pour la page d'accueil

#### Menu de navigation (preview)
- S'affiche automatiquement si >1 page visible dans menu
- Barre avec nom du site à gauche, liens à droite
- Couleur = couleur primaire du thème
- Clic sur un lien = navigation vers la page

#### Site public
- Menu affiché si plusieurs pages avec `showInMenu: true`
- Navigation fonctionnelle entre les pages

---

## 5. User Stories

### US-01 : Création de site
```
En tant qu'utilisateur non technique,
Je veux créer un site web en quelques minutes,
Afin d'avoir une présence en ligne pour mon activité.

Critères d'acceptance :
- [x] Onboarding en 5 étapes max
- [x] Choix thème avec preview visuel
- [x] Lien secret affiché avec option Copier
```

### US-02 : Sélection de thème
```
En tant qu'utilisateur,
Je veux voir des thèmes avec aperçu visuel,
Afin de choisir celui qui correspond à mon activité.

Critères d'acceptance :
- [x] 6 thèmes disponibles
- [x] Image preview pour chaque
- [x] Palette de couleurs visible
- [x] Sélection visuelle claire
```

### US-03 : Modale de paramétrage
```
En tant qu'utilisateur dans l'éditeur,
Je veux une modale de paramétrage complète,
Afin de personnaliser mon site facilement.

Critères d'acceptance :
- [x] Modale 420px, accordéon
- [x] 3 sections : Pages, Design, Médias
- [x] Modifications temps réel
```

### US-04 : Édition visuelle
```
En tant qu'utilisateur,
Je veux modifier le contenu en cliquant dessus,
Afin de personnaliser sans interface complexe.

Critères d'acceptance :
- [x] Textes éditables au clic
- [x] Sauvegarde automatique
- [x] Indicateur "Modifications enregistrées"
```

### US-05 : Publication
```
En tant qu'utilisateur,
Je veux publier en un clic,
Afin que mon site soit visible par tous.

Critères d'acceptance :
- [x] Bouton Publier visible
- [x] Confirmation affichée
- [x] URL publique donnée
```

### US-06 : Site multipage
```
En tant qu'utilisateur,
Je veux créer plusieurs pages,
Afin d'organiser mon contenu.

Critères d'acceptance :
- [x] Création pages depuis modale
- [x] Menu navigation automatique
- [x] Onglets pour naviguer dans l'éditeur
- [x] Réorganisation possible
```

### US-07 : Drag & Drop images
```
En tant qu'utilisateur,
Je veux ajouter des images par glisser-déposer,
Afin de personnaliser facilement.

Critères d'acceptance :
- [x] Overlay visuel au survol
- [x] Upload automatique
- [x] Ajout à la médiathèque
```

### US-08 : Modifications temps réel
```
En tant qu'utilisateur,
Je veux voir les changements de design immédiatement,
Afin de visualiser le résultat en direct.

Critères d'acceptance :
- [x] Changement thème = mise à jour instantanée
- [x] Couleurs = preview temps réel
- [x] Polices = application immédiate
```

---

## 6. Règles UX et Microcopy

### Ton éditorial
- Simple et direct
- Rassurant et positif
- Jamais condescendant
- Orienté action

### Messages clés

| Contexte | Message |
|----------|---------|
| Début onboarding | "Créez votre site en quelques minutes, sans aucune connaissance technique" |
| Choix thème | "Choisissez un modèle. Vous pourrez le personnaliser à votre goût" |
| Lien secret | "Copiez ce lien et gardez-le précieusement. C'est votre clé pour modifier votre site" |
| Modale ouverte | "Personnalisez votre site" |
| Sauvegarde | "✓ Modifications enregistrées" |
| Temps réel | "Les modifications sont appliquées en temps réel" |
| Publication | "Félicitations ! Votre site est maintenant en ligne" |
| Drag & drop | "Déposez vos images ici — Elles seront ajoutées à votre médiathèque" |
| Page vide | "Cette page est vide. Ajoutez du contenu via les paramètres" |

---

## 7. Hors périmètre (explicite)

- ❌ Login / mot de passe / gestion de compte
- ❌ Solutions techniques (voir ARCHITECTURE.md)
- ❌ Choix de stack ou architecture
- ❌ Code ou pseudo-code

---

## 8. Références design

- Design system OVHcloud : https://github.com/ovh/design-system
- Charte graphique : https://zeroheight.com/6fc8a63f7/p/394306-welcome-to-the-brand-hub

---

*Document généré par Agent 200 EXPLORER PM/PO — 3 février 2026*
