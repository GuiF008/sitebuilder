# QA_CHECKLIST.md — Validation OVHcloud Site Builder v2

> **Agent** : 600 TESTER QA  
> **Date** : 3 février 2026

---

## Checklist de validation

### 1. Landing page (/)

- [ ] Page d'accueil accessible
- [ ] Header avec logo et bouton "Créer mon site"
- [ ] Hero avec CTA visible
- [ ] Section features affichée
- [ ] Section thèmes avec 6 previews
- [ ] Footer présent

### 2. Onboarding (/onboarding)

- [ ] Barre de progression visible (5 étapes)
- [ ] **Étape 1** : Champs nom et email fonctionnels
- [ ] **Étape 1** : Validation des champs requis
- [ ] **Étape 2** : 4 cartes objectifs cliquables
- [ ] **Étape 3** : Galerie de 6 thèmes affichée
- [ ] **Étape 3** : Preview visuel pour chaque thème
- [ ] **Étape 3** : Pastilles de couleurs visibles
- [ ] **Étape 3** : Sélection avec checkmark
- [ ] **Étape 4** : Checkboxes des sections
- [ ] **Étape 5** : Options des besoins (dont Premium)
- [ ] Boutons Retour/Continuer fonctionnels

### 3. Page succès (/onboarding/success)

- [ ] Message de félicitations affiché
- [ ] Lien secret visible et complet
- [ ] Bouton "Copier" fonctionne
- [ ] Avertissement "lien unique" visible
- [ ] CTA "Accéder à l'éditeur" fonctionne

### 4. Éditeur (/edit/[token])

#### Header
- [ ] Bouton menu (☰) visible
- [ ] Nom du site affiché
- [ ] Bouton "Voir le site" (si publié)
- [ ] Bouton "Upgrade" présent
- [ ] Bouton "Publier" fonctionnel

#### Modale accordéon (420px)
- [ ] Modale s'ouvre au clic sur ☰
- [ ] Largeur fixe 420px
- [ ] 3 sections accordéon présentes
- [ ] Section ouverte = bordure bleue à gauche
- [ ] Fermeture avec bouton ✕

#### Section 📄 Pages & Menu
- [ ] Liste des pages affichée
- [ ] Boutons réordonner (↑↓) fonctionnels
- [ ] Bouton page d'accueil (🏠) fonctionnel
- [ ] Bouton visibilité menu (👁️) fonctionnel
- [ ] Bouton supprimer (🗑️) avec confirmation
- [ ] Bouton "Ajouter une page" fonctionnel
- [ ] Création de page effective

#### Section 🎨 Design
- [ ] Grille des 6 thèmes cliquables
- [ ] Changement de thème = temps réel
- [ ] 5 color pickers présents
- [ ] Changement couleur = temps réel
- [ ] 2 sélecteurs de polices
- [ ] Changement police = temps réel
- [ ] 3 options de style bouton

#### Section 🖼️ Médiathèque
- [ ] Zone d'upload cliquable
- [ ] Filtres (Tous/Images/Vidéos/Sons)
- [ ] Galerie des médias uploadés
- [ ] Bouton copier URL fonctionne
- [ ] Bouton supprimer fonctionne

### 5. Zone d'édition

- [ ] Onglets de pages visibles (si >1 page)
- [ ] Clic sur onglet = changement de page
- [ ] Menu navigation preview (si >1 page)
- [ ] Sections du site affichées
- [ ] Textes éditables au clic (contentEditable)

### 6. Drag & Drop global

- [ ] Survol avec fichier = overlay bleu
- [ ] Message "Déposez vos images ici"
- [ ] Animation bounce sur l'icône
- [ ] Drop = upload effectif
- [ ] Image apparaît dans médiathèque

### 7. Publication

- [ ] Bouton Publier fonctionne
- [ ] Confirmation affichée
- [ ] Site accessible sur /s/[slug]

### 8. Site public (/s/[slug])

- [ ] Page accessible
- [ ] Menu navigation (si multipage)
- [ ] Navigation entre pages fonctionne
- [ ] Thème correctement appliqué
- [ ] Sections rendues correctement
- [ ] Badge freemium visible (si non premium)
- [ ] 404 si site non publié

### 9. Persistance

- [ ] Données sauvegardées après modification
- [ ] Données persistent après refresh page
- [ ] Données persistent après redémarrage Docker
- [ ] Médias uploadés persistent

### 10. Temps réel

- [ ] Changement thème = instantané (pas de reload)
- [ ] Changement couleur = instantané
- [ ] Changement police = instantané
- [ ] Indicator "Modifications enregistrées" visible

---

## Scénarios de test E2E

### Scénario 1 : Parcours complet

1. Aller sur /
2. Cliquer "Créer mon site"
3. Remplir nom + email → Continuer
4. Sélectionner "Vitrine" → Continuer
5. Sélectionner un thème → Continuer
6. Cocher des sections → Continuer
7. Cliquer "Créer mon site"
8. Copier le lien secret
9. Accéder à l'éditeur
10. Ouvrir la modale, changer de thème
11. Créer une nouvelle page
12. Publier
13. Vérifier le site public

**Résultat attendu** : Site créé, édité et publié avec succès

### Scénario 2 : Modifications temps réel

1. Accéder à l'éditeur
2. Ouvrir Design > Modèles
3. Changer de thème
4. Vérifier changement instantané
5. Modifier une couleur
6. Vérifier changement instantané
7. Changer une police
8. Vérifier changement instantané

**Résultat attendu** : Toutes les modifications sont immédiates

### Scénario 3 : Drag & Drop

1. Accéder à l'éditeur
2. Glisser une image depuis le bureau
3. Vérifier overlay bleu
4. Déposer l'image
5. Vérifier dans Médiathèque

**Résultat attendu** : Image uploadée et visible

---

## Erreurs bloquantes connues

| ID | Description | Criticité |
|----|-------------|-----------|
| ERR-001 | Token invalide non géré | 🔴 Critique |
| ERR-002 | Échec sauvegarde silencieux | 🔴 Critique |
| ERR-003 | Temps réel ne fonctionne pas | 🔴 Critique |
| ERR-004 | Modale ne s'ouvre pas | 🟠 Haute |
| ERR-005 | Drag & drop bloqué | 🟠 Haute |
| ERR-006 | Pages non réordonnables | 🟡 Moyenne |

---

## Validation finale

- [ ] **Création** : Utilisateur peut créer un site sans compte
- [ ] **Thèmes** : Galerie avec preview dans onboarding
- [ ] **Modale** : Accordéon 420px fonctionnel
- [ ] **Temps réel** : Modifications instantanées
- [ ] **Drag & Drop** : Upload par glisser-déposer
- [ ] **Multipage** : Onglets et menu fonctionnels
- [ ] **Publication** : Site public accessible
- [ ] **Lien secret** : Retour à l'édition possible
- [ ] **Persistance** : Données conservées après restart

---

*Document généré par Agent 600 TESTER QA — 3 février 2026*
