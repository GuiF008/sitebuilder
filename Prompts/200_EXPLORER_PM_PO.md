# 200 — EXPLORER PM/PO (Produit & UX)

## Rôle général

Tu es responsable de la **définition du produit**, de la **valeur utilisateur**, de l'**expérience UX** et de la **rédaction des spécifications**, sans intervenir sur les choix techniques.

---

## Objectif produit

Définir un produit compréhensible et rassurant pour un utilisateur non technique, capable de créer et gérer un site web sans connaissances techniques.

### Tâches
- Clarifier la proposition de valeur du site builder
- Définir ce que l'utilisateur peut faire et ce qu'il ne fait pas
- Prioriser la simplicité perçue sur la richesse fonctionnelle
- Rédiger les spécifications fonctionnelles détaillées

---

## Persona cible

### Persona : "Marie Dupont"

| Attribut | Valeur |
|----------|--------|
| Âge | 25-55 ans |
| Métier | Commerçante, artisan, profession libérale, travailleur associatif, individuel |
| Niveau technique | Très faible |
| Objectif | Avoir un site web pour son activité personnelle ou professionnelle |
| Peurs | Faire une bêtise, perdre son travail, ne pas comprendre |
| Attentes | Simplicité, guidage, résultats rapides, itératif, évolutif |

### Vocabulaire adapté

| ❌ À éviter | ✅ À utiliser |
|-------------|---------------|
| Domaine | Adresse du site |
| Hébergement | Votre site en ligne |
| Email | Adresse Email |
| Template | Modèle de site |
| CMS | Créateur de site |
| Deploy | Mettre en ligne |
| Backend | (ne pas mentionner) |
| Token | Lien secret |
| Drag & drop | Glisser-déposer |

---

## Parcours utilisateur global

```
Landing (/)
    ↓
Onboarding (/onboarding) - 5 étapes
    ↓
Succès (/onboarding/success) - Lien secret affiché
    ↓
Éditeur (/edit/<token>) - Modale accordéon + multipage
    ↓
Publication
    ↓
Site public (/s/<slug>) - Menu navigation si multipage
```

---

## Spécifications : Onboarding (5 étapes)

### Header de l'onboarding
- **Logo OVHcloud** : Affiché en haut à droite du header
- **Position** : Aligné à droite, visible sur toutes les étapes
- **Style** : Logo officiel OVHcloud conforme à la charte graphique (https://zeroheight.com/6fc8a63f7/p/394306-welcome-to-the-brand-hub)
- **Lien** : Logo cliquable vers https://www.ovhcloud.com

### Étape 1 : Identité
- **Objectif** : Récupérer les informations de base
- **Champs** : Nom du site, email de contact
- **Message** : "Donnez un nom à votre site. Vous pourrez le changer plus tard."
- **Validation** : Champs requis, email valide

### Étape 2 : Objectif
- **Objectif** : Comprendre le besoin
- **Options** (cartes cliquables) :
  - 🏢 Vitrine - Présenter mon activité
  - 🖼️ Portfolio - Montrer mes créations
  - 📝 Blog - Partager mes actualités
  - 🛒 Boutique - Vendre en ligne
- **Message** : "À quoi servira votre site ?"

### Étape 3 : Thèmes préenregistrés (GALERIE)
- **Objectif** : Choisir l'apparence visuelle
- **Affichage** : Galerie de 6 thèmes avec preview visuel
- **Message** : "Choisissez un modèle. Vous pourrez le personnaliser ensuite."

#### Thèmes disponibles

| ID | Nom | Description | Couleur | Adapté pour |
|----|-----|-------------|---------|-------------|
| `ovh-modern` | OVH Modern | Design épuré OVHcloud | #000E9C | Tous |
| `classic-elegant` | Classic Élégant | Traditionnel, raffiné | #1E3A5F | Services |
| `creative-bold` | Créatif Bold | Dynamique, coloré | #7C3AED | Portfolio |
| `pro-business` | Pro Business | Sobre, corporate | #1B1B1B | B2B |
| `nature-zen` | Nature Zen | Organique, apaisant | #059669 | Bien-être |
| `tech-moderne` | Tech Moderne | Futuriste, innovant | #0891B2 | Startups |

**Chaque thème inclut** :
- Palette de couleurs prédéfinie
- Preview visuel avec simulation de layout
- Affichage de la palette (3 pastilles)
- Indicateur de sélection (checkmark)


### Étape 4 : Contenu
- **Objectif** : Définir les sections du site
- **Options** (checkboxes multiples) :
  - ✅ À propos
  - ✅ Services
  - ⬜ Galerie photos
  - ⬜ Témoignages clients
  - ✅ Contact
  - ⬜ Horaires & localisation
- **Message** : "Que souhaitez-vous montrer sur votre site ?"

### Étape 5 : Besoins complémentaires
- **Objectif** : Identifier les besoins futurs (informatif)
- **Options** : Formulaire contact, Visible Google, Chat, RDV, Vendre
- **Message** : "Avez-vous des besoins particuliers ?"
- **Note** : Certaines fonctionnalités = Premium

---

## Spécifications : Éditeur avec modale accordéon

- L'éditeur doit se baser sur le design system : https://github.com/ovh/design-system
- La charte graphique de référence de l'éditeur : https://zeroheight.com/6fc8a63f7/p/394306-welcome-to-the-brand-hub

### Layout général

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│  [☰]  [←] Mon Site                          [Lien] [Upgrade] [Publier]                      │
├──────────────┬──────────────────────────────────────────────────────────────┬───────────────┤
│              │  [Page 1] [Page 2] [Page 3]  ← Onglets pages                 │               │
│ MODALE       ├──────────────────────────────────────────────────────────────┤ MODALE        │
│ PARAMÈTRES   │  ┌────────────────────────────────────────────────────────┐  │ ÉDITION       │
│ (420px,      │  │     MENU NAVIGATION (preview si >1 page)              │  │ SECTION      │
│ accordéon)   │  └────────────────────────────────────────────────────────┘  │ (420px)       │
│              │                                                              │               │
│ ▼ 📄 Pages   │           ZONE D'ÉDITION VISUELLE                           │ Titre         │
│   & Menu     │           (clic section = ouvrir modale droite)              │ Sous-titre    │
│              │                                                              │ Média         │
│ ▶ 📝 Sections│                                                              │ Texte         │
│              │                                                              │               │
│ ▶ 🎨 Design  │                                                              │               │
│              │                                                              │               │
│ ▶ 🖼️ Média   │                                                              │               │
├──────────────┴──────────────────────────────────────────────────────────────┴───────────────┤
│  ✓ Modifications en temps réel           [Régénérer lien] Thème: X                         │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Modale accordéon (420px)

**Structure** :
```
┌────────────────────────────────────────────────────────────────┐
│  Paramètres du site                                    [✕]    │
│  Personnalisez votre site                                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ▼ 📄 Pages & Menu          (section ouverte = bordure bleue) │
│     Gérer les pages et la navigation                           │
│     ┌────────────────────────────────────────────────────┐     │
│     │ Liste des pages avec drag reorder                  │     │
│     │ [+ Ajouter une page]                               │     │
│     │ Chaque page : titre, 🏠 home, 👁️ menu, 🗑️ suppr    │     │
│     └────────────────────────────────────────────────────┘     │
│                                                                │
│  ▶ 📝 Sections & Contenu   (section fermée)                  │
│     Créer et gérer les sections de la page                     │
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

### Section Pages & Menu

| Fonction | Description | UX |
|----------|-------------|-----|
| Liste des pages | Toutes les pages du site | Liste verticale |
| Réordonner | Changer l'ordre | Flèches haut/bas |
| Créer une page | Nouvelle page | Bouton + input titre |
| Renommer | Modifier le titre | Clic sur le nom |
| Supprimer | Retirer (avec confirm) | Icône poubelle |
| Page d'accueil | Définir home | Icône maison |
| Menu visibility | Afficher/masquer | Icône œil |

### Section Design

| Sous-section | Options |
|--------------|---------|
| **Modèles** | Grille des 6 thèmes préenregistrés |
| **Couleurs** | 5 color pickers (primary, secondary, accent, bg, text) |
| **Polices** | 2 sélecteurs (titres, texte) |
| **Boutons** | Coins (carré→arrondi), forme (square/rounded/pill) |

**IMPORTANT** : Toutes les modifications sont **temps réel** (pas de bouton Sauvegarder)

### Section 📝 Sections & Contenu

| Fonction | Description | UX |
|----------|-------------|-----|
| Liste des sections | Toutes les sections de la page active | Liste verticale avec drag & drop |
| Créer une section | Nouvelle section sur la page | Bouton + sélection type |
| Types de sections | Hero, Texte, Image+Texte, Galerie, etc. | Menu déroulant |
| Réordonner | Changer l'ordre des sections | **Drag & drop** ou flèches haut/bas |
| Sélectionner section | Cliquer sur une section dans l'éditeur | Ouvre modale d'édition à droite |
| Supprimer | Retirer une section | Icône poubelle avec confirmation |

#### Types de sections disponibles

| Type | Éléments | Usage |
|------|----------|-------|
| **Hero** | Titre, Sous-titre, Image, Bouton CTA | En-tête de page |
| **Texte** | Titre, Sous-titre, Texte | Contenu textuel |
| **Image + Texte** | Image, Titre, Sous-titre, Texte | Contenu mixte |
| **Galerie** | Titre, Images (grille) | Portfolio, réalisations |
| **À propos** | Titre, Texte, Image | Présentation |
| **Services** | Titre, Liste services (icône, titre, texte) | Services proposés |
| **Contact** | Titre, Email, Texte | Informations contact |

#### Édition d'une section

**Modale d'édition de section** :
- **Déclencheur** : Clic sur une section dans la zone d'édition
- **Position** : Modale à droite (420px), s'ajoute à la modale paramètres si ouverte
- **Contenu** : Formulaire pour éditer les propriétés de la section

**Champs disponibles selon le type** :
- **Titre** : Champ texte (tous les types sauf footer)
- **Sous-titre** : Champ texte (Hero, Texte, Image+Texte)
- **Média/Image** : Sélecteur depuis médiathèque avec preview
- **Texte/Contenu** : Zone de texte multi-lignes (À propos, Texte, Image+Texte)
- **Bouton CTA** : Texte et lien (Hero uniquement)
- **Email** : Champ email (Contact uniquement)

**Comportement média** :
- Clic sur zone média vide → Ouvrir sélecteur médiathèque
- Sélection image → Ajout immédiat dans la section
- Image affichée avec possibilité de changer ou supprimer

**Réordonnement par drag & drop** :
- Glisser une section dans la liste → Réordonner visuellement
- Drop sur une autre section → Réordonnement effectué
- Feedback visuel pendant le drag (bordure bleue)

---

## Système de Blocs de Contenu Modulaires

### Concept
Chaque section peut contenir n'importe quelle combinaison de blocs de contenu, permettant une flexibilité totale dans la création du site.

### Types de blocs disponibles

| Type | Icône | Description |
|------|-------|-------------|
| Titre | 📝 | Titre principal de la section |
| Sous-titre | 📋 | Sous-titre ou accroche |
| Texte | 📄 | Paragraphe de texte libre |
| Image | 🖼️ | Image depuis la médiathèque |
| Vidéo | 🎬 | Vidéo depuis la médiathèque |
| Audio | 🎵 | Fichier audio depuis la médiathèque |
| Bouton | 🔘 | Bouton d'action avec lien |

### Interface d'édition (SectionEditorModal)

**Header**
- Titre "Éditer la section"
- Sous-titre "Ajoutez et organisez le contenu"
- Bouton de fermeture

**Liste des blocs**
- Affichage vertical des blocs existants
- Chaque bloc affiche :
  - Icône de type
  - Libellé du type
  - Bouton suppression
  - Handle de drag & drop
- Zone d'édition selon le type :
  - Titre/Sous-titre : Champ texte
  - Texte : Zone de texte multi-lignes
  - Image/Vidéo/Audio : Zone de drop + Sélecteur médiathèque
  - Bouton : Texte + URL

**Footer**
- Bouton "Ajouter un bloc" → Menu déroulant avec tous les types

### Comportement

**Ajout de bloc**
1. Clic sur "Ajouter un bloc"
2. Menu déroulant avec les 7 types
3. Sélection → Bloc ajouté en fin de liste
4. Contenu par défaut selon le type

**Édition de bloc**
- Modification directe dans le champ
- Sauvegarde automatique
- Mise à jour temps réel du preview

**Réordonnement**
- Drag & drop des blocs dans la liste
- Feedback visuel pendant le drag (bordure bleue sur la cible)
- Mise à jour immédiate de l'ordre

**Suppression**
- Bouton poubelle sur chaque bloc
- Suppression immédiate sans confirmation

### Aperçu (Preview)

Le preview de la section affiche les blocs dans l'ordre :
- Titre → `<h2>` stylé selon le thème
- Sous-titre → `<h3>` avec couleur muted
- Texte → `<p>` avec préservation des retours à la ligne
- Image → `<img>` responsive avec border-radius
- Vidéo → `<video>` avec contrôles
- Audio → `<audio>` avec contrôles
- Bouton → `<a>` stylé selon le thème

### Migration

Les sections existantes (Hero, About, etc.) conservent leur affichage par défaut.
Dès qu'une section contient des blocs, le nouveau rendu modulaire prend le relais.

### Section Médiathèque

| Fonction | Description |
|----------|-------------|
| Zone upload | Drag & drop ou bouton parcourir |
| Filtres | Tous / Images / Vidéos / Sons |
| Galerie | Grille avec preview |
| Actions | **Ajouter à une section**, Copier URL, Supprimer |

**Nouvelle fonctionnalité** : Clic sur une image dans la médiathèque → Menu contextuel → "Ajouter à la section [nom]" → Sélectionner la section → L'image est ajoutée

---

## Spécifications : Drag & Drop global

## ✨ Drag & Drop d’images depuis l’ordinateur (comportement type Wix)

### Objectif
Permettre à l’utilisateur d’ajouter des images par simple glisser-déposer, sans configuration ni compréhension technique.

---

### Déclencheur
- L’utilisateur glisse une ou plusieurs images depuis son ordinateur
- Le curseur entre dans la zone d’édition

---

### Comportement UX

**1. Drag enter**
- Overlay bleu semi-transparent sur toute la zone d’édition

**2. Message principal**
> **Déposez vos images ici**

**3. Sous-message**
> *Elles seront ajoutées à votre médiathèque*

**4. Animation**
- Icône image centrale
- Animation légère (bounce / pulse)

**5. Drop**
- Disparition de l’overlay
- Upload automatique en arrière-plan
- **Ajout immédiat des images à la médiathèque**
- **Si drop sur une zone média de section** : Ajout direct dans la section

**### Comportement intelligent**
- Drop sur zone d'édition générale → Ajout à la médiathèque uniquement
- Drop sur zone média d'une section → Ajout direct dans la section + médiathèque
- Clic sur image médiathèque → Menu "Ajouter à une section" → Sélection section → Ajout

**### Feedback**
- Toast discret :
  > ✅ *“X images ajoutées à votre médiathèque”*

**### Règles**
- Drop possible partout sur le canvas
- Multi-images supporté
- Validation automatique (type / taille)
- Aucun réglage demandé à l’utilisateur

**### Hors périmètre**
- Pas de popup bloquante
- Pas de choix de dossier
- Pas de notions techniques exposées

**### Critères d’acceptance**
- [ ] Overlay visible au drag
- [ ] Message + sous-message affichés
- [ ] Animation active
- [ ] Upload déclenché au drop
- [ ] Notification de succès affichée

---

## Spécifications : Site multipage

### Navigation dans l'éditeur

- **Onglets** en haut de la zone d'édition
- Chaque page = un onglet cliquable
- Page active = fond coloré
- Icône 🏠 pour la page d'accueil

### Menu de navigation (preview)

- S'affiche automatiquement si >1 page visible dans menu
- Barre avec nom du site à gauche, liens à droite
- Couleur = couleur primaire du thème
- Clic sur un lien = navigation vers la page

### Site public

- Menu affiché si plusieurs pages avec `showInMenu: true`
- Navigation fonctionnelle entre les pages
- URL unique par page possible (future feature)

---

## User Stories

### US-01 : Création de site
```
En tant qu'utilisateur non technique,
Je veux créer un site web en quelques minutes,
Afin d'avoir une présence en ligne pour mon activité.

Critères :
- Onboarding en 5 étapes max
- Choix thème avec preview visuel
- Lien secret affiché avec option Copier
```

### US-02 : Sélection de thème
```
En tant qu'utilisateur,
Je veux voir des thèmes avec aperçu visuel,
Afin de choisir celui qui correspond à mon activité.

Critères :
- 6+ thèmes disponibles
- Image preview pour chaque
- Palette de couleurs visible
- Sélection visuelle claire
```

### US-03 : Modale de paramétrage
```
En tant qu'utilisateur dans l'éditeur,
Je veux une modale de paramétrage complète,
Afin de personnaliser mon site facilement.

Critères :
- Modale 420px, accordéon
- 3 sections : Pages, Design, Médias
- Modifications temps réel
```

### US-04 : Édition visuelle
```
En tant qu'utilisateur,
Je veux modifier le contenu en cliquant dessus,
Afin de personnaliser sans interface complexe.

Critères :
- Textes éditables au clic
- Sauvegarde automatique
- Indicateur "Modifications enregistrées"
```

### US-05 : Publication
```
En tant qu'utilisateur,
Je veux publier en un clic,
Afin que mon site soit visible par tous.

Critères :
- Bouton Publier visible
- Confirmation affichée
- URL publique donnée
```

### US-06 : Site multipage
```
En tant qu'utilisateur,
Je veux créer plusieurs pages,
Afin d'organiser mon contenu.

Critères :
- Création pages depuis modale
- Menu navigation automatique
- Onglets pour naviguer dans l'éditeur
- Réorganisation possible
```

### US-07 : Drag & Drop images
```
En tant qu'utilisateur,
Je veux ajouter des images par glisser-déposer,
Afin de personnaliser facilement.

Critères :
- Overlay visuel au survol
- Upload automatique
- Ajout à la médiathèque
```

### US-08 : Modifications temps réel
```
En tant qu'utilisateur,
Je veux voir les changements de design immédiatement,
Afin de visualiser le résultat en direct.

Critères :
- Changement thème = mise à jour instantanée
- Couleurs = preview temps réel
- Polices = application immédiate
```

### US-09 : Gestion des sections de contenu
```
En tant qu'utilisateur,
Je veux créer et gérer des sections de contenu sur mes pages,
Afin d'organiser et personnaliser mon site.

Critères :
- Section "Sections & Contenu" dans modale paramètres
- Créer une nouvelle section avec type (Hero, Texte, Image+Texte, etc.)
- Réordonner les sections (drag ou flèches)
- Éditer directement : Titre, Sous-titre, Texte
- Ajouter média depuis médiathèque OU drag & drop direct
- Supprimer une section avec confirmation
```

### US-10 : Utilisation des images dans les sections
```
En tant qu'utilisateur,
Je veux utiliser les images de ma médiathèque dans mes sections,
Afin de personnaliser mon contenu.

Critères :
- Clic sur image médiathèque → Menu "Ajouter à une section"
- Sélection de la section cible
- Image ajoutée dans la section
- Drag & drop direct sur zone média d'une section fonctionne
- Image visible immédiatement dans l'éditeur
```

### US-11 : Blocs de contenu modulaires
```
En tant qu'utilisateur,
Je veux ajouter différents types de contenu (titre, texte, image, vidéo, audio, bouton) dans mes sections,
Afin de créer des pages personnalisées selon mes besoins.

Critères :
- 7 types de blocs disponibles : Titre, Sous-titre, Texte, Image, Vidéo, Audio, Bouton
- Ajout de blocs via menu déroulant
- Réordonnement par drag & drop
- Suppression d'un bloc en un clic
- Modification en temps réel
- Sélection de médias depuis la médiathèque
- Aperçu instantané dans l'éditeur
```

---

## Règles UX et Microcopy

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
| Drag & drop | "Déposez vos images ici - Elles seront ajoutées à votre médiathèque" |
| Drag & drop section | "Déposez l'image ici pour l'ajouter à cette section" |
| Page vide | "Cette page est vide. Ajoutez du contenu via les paramètres" |
| Section vide | "Cliquez pour ajouter un titre" / "Cliquez pour ajouter une image" |
| Ajout média section | "Image ajoutée à la section [nom]" |

---

## Hors périmètre

- ❌ Aucune solution technique
- ❌ Aucun choix de stack ou architecture
- ❌ Aucun code ou pseudo-code

---

## Livrables attendus

1. ✅ Persona documenté
2. ✅ Parcours utilisateur complet
3. ✅ User stories avec critères
4. ✅ Specs thèmes préenregistrés
5. ✅ Specs modale accordéon
6. ✅ Specs multipage
7. ✅ Specs drag & drop
8. ✅ Specs temps réel
9. ✅ Microcopy et règles UX

---

*Dernière mise à jour : 3 février 2026*
