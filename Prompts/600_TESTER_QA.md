# 600 — TESTER QA

## Rôle général

Tu es responsable de la **validation fonctionnelle** du prototype avant démonstration et déploiement.

---

## Objectif qualité

Garantir que le prototype fonctionne dans les scénarios critiques.

### Tâches
- Identifier les parcours essentiels
- Détecter les points de rupture
- Valider la cohérence globale
- Rédiger les tests automatisés

---

## Scénarios de test prioritaires

### Scénario 1 : Création de site complète

```gherkin
Feature: Création de site
  En tant qu'utilisateur
  Je veux créer un site via l'onboarding
  Afin d'obtenir un lien d'édition secret

  Scenario: Happy path création
    Given je suis sur la page d'accueil
    When je clique sur "Créer mon site"
    Then je suis redirigé vers /onboarding

    # Étape 1 : Identité
    When je saisis "Mon Super Site" dans le champ nom
    And je saisis "test@example.com" dans le champ email
    And je clique sur "Continuer"
    Then je passe à l'étape 2

    # Étape 2 : Objectif
    When je sélectionne "Vitrine"
    Then je passe à l'étape 3

    # Étape 3 : Thème (GALERIE)
    When je vois une galerie de 6 thèmes
    And chaque thème a un preview visuel
    And je sélectionne "OVH Modern"
    Then le thème est visuellement mis en évidence
    And je clique sur "Continuer"

    # Étape 4 : Contenu
    When je coche "À propos" et "Contact"
    And je clique sur "Continuer"

    # Étape 5 : Besoins
    When je clique sur "Créer mon site"
    Then je suis redirigé vers /onboarding/success
    And je vois un lien d'édition
    And je peux copier ce lien
```

### Scénario 2 : Modale accordéon

```gherkin
Feature: Modale de paramétrage
  En tant qu'utilisateur dans l'éditeur
  Je veux utiliser la modale accordéon
  Afin de configurer mon site

  Scenario: Ouvrir/fermer la modale
    Given je suis dans l'éditeur
    When je clique sur le bouton menu (☰)
    Then la modale 420px s'ouvre sur la gauche
    And la section "Pages & Menu" est ouverte par défaut

  Scenario: Navigation accordéon
    Given la modale est ouverte
    When je clique sur "🎨 Design du site"
    Then la section Design se déplie
    And je vois les sous-sections (Modèles, Couleurs, Polices, Boutons)
    
    When je clique sur "📄 Pages & Menu"
    Then la section Pages se déplie
    And la section Design reste ouverte (multi-accordéon)

  Scenario: Créer une page
    Given la modale est ouverte sur Pages & Menu
    When je clique sur "Ajouter une page"
    And je saisis "Nos services"
    And je valide
    Then la page apparaît dans la liste
    And un nouvel onglet apparaît en haut de l'éditeur
```

### Scénario 3 : Modifications temps réel

```gherkin
Feature: Temps réel
  En tant qu'utilisateur
  Je veux voir mes changements immédiatement
  Afin de visualiser le résultat

  Scenario: Changement de thème
    Given je suis dans l'éditeur
    And la modale est ouverte sur Design > Modèles
    When je clique sur le thème "Creative Bold"
    Then les couleurs du site changent instantanément
    And pas besoin de recharger la page

  Scenario: Changement de couleur
    Given je suis dans l'éditeur
    And la modale est ouverte sur Design > Couleurs
    When je modifie la couleur primaire en #FF0000
    Then tous les éléments primaires deviennent rouges immédiatement

  Scenario: Changement de police
    Given je suis dans l'éditeur
    And la modale est ouverte sur Design > Polices
    When je change la police des titres en "Georgia"
    Then tous les titres changent de police instantanément
```

### Scénario 4 : Drag & Drop images (comportement type Wix)

```gherkin
Feature: Drag & Drop d'images
  En tant qu'utilisateur
  Je veux ajouter des images par glisser-déposer
  Afin de personnaliser facilement mon site

  Background:
    Given je suis dans l'éditeur

  Scenario: Drag enter - Overlay visible
    When je commence à glisser un fichier image depuis mon ordinateur
    Then un overlay bleu semi-transparent couvre l'écran
    And je vois le message "Déposez vos images ici"
    And je vois le sous-message "Elles seront ajoutées à votre médiathèque"
    And l'icône image fait un effet bounce/pulse

  Scenario: Drop réussi - Upload automatique
    Given l'overlay de drag est visible
    When je dépose l'image sur la zone d'édition
    Then l'overlay disparaît immédiatement
    And l'upload démarre automatiquement en arrière-plan
    And un toast s'affiche "1 image ajoutée à votre médiathèque"
    And l'image apparaît dans la médiathèque

  Scenario: Multi-images supporté
    When je glisse et dépose 3 images simultanément
    Then les 3 images sont uploadées en parallèle
    And un toast s'affiche "3 images ajoutées à votre médiathèque"

  Scenario: Fichier non-image rejeté
    When je glisse un fichier .pdf sur la zone d'édition
    Then l'overlay ne s'affiche PAS
    Or si déposé, le fichier est ignoré silencieusement

  Scenario: Drag leave - Overlay disparaît
    Given l'overlay de drag est visible
    When je déplace le fichier hors de la zone d'édition
    Then l'overlay disparaît
```

### Scénario 5 : Site multipage

```gherkin
Feature: Multipage
  En tant qu'utilisateur
  Je veux un site avec plusieurs pages
  Afin d'organiser mon contenu

  Scenario: Navigation entre pages
    Given j'ai créé 3 pages (Accueil, Services, Contact)
    Then je vois 3 onglets en haut de l'éditeur
    When je clique sur "Services"
    Then le contenu de la page Services s'affiche
    And l'onglet Services est actif (fond coloré)

  Scenario: Menu de navigation preview
    Given j'ai 2+ pages visibles dans le menu
    Then un menu de navigation apparaît en preview
    And il affiche le nom du site à gauche
    And les liens des pages à droite
    
    When je clique sur un lien dans le menu preview
    Then je navigue vers cette page

  Scenario: Page d'accueil
    Given j'ai plusieurs pages
    When je définis "Services" comme page d'accueil
    Then l'icône 🏠 apparaît sur Services
    And cette page sera affichée en premier sur le site public
```

### Scénario 6 : Publication multipage

```gherkin
Feature: Publication
  En tant qu'utilisateur
  Je veux publier mon site multipage
  Afin qu'il soit accessible publiquement

  Scenario: Publication avec menu
    Given j'ai un site avec 3 pages
    When je clique sur "Publier"
    Then le site est publié avec toutes les pages
    
    When je visite le site public
    Then je vois le menu de navigation
    And je peux naviguer entre les pages
```

### Scénario 7 : Persistance

```gherkin
Feature: Persistance
  En tant qu'utilisateur
  Je veux que mes données persistent
  Afin de ne rien perdre

  Scenario: Redémarrage Docker
    Given j'ai créé et publié un site
    And j'ai uploadé des images
    When le container Docker redémarre
    Then mon site est toujours accessible via le lien secret
    And le site public est toujours en ligne
    And les images uploadées sont toujours disponibles
    And mes pages personnalisées sont conservées
```

---

## Checklist de validation

### Onboarding

- [ ] Page d'accueil accessible
- [ ] CTA "Créer mon site" fonctionne
- [ ] **Logo OVHcloud visible en haut à droite du header**
- [ ] **Logo OVHcloud cliquable vers ovhcloud.com**
- [ ] 5 étapes fonctionnelles
- [ ] Galerie de 6 thèmes affichée avec previews
- [ ] Sélection de thème visuelle
- [ ] Lien secret affiché à la fin
- [ ] Bouton "Copier" fonctionne

### Éditeur - Modale accordéon

- [ ] Modale 420px s'ouvre/ferme
- [ ] Sections en accordéon (clic = déplie)
- [ ] Bordure bleue sur section active
- [ ] Pages : CRUD complet
- [ ] Pages : Réordonner fonctionne
- [ ] Pages : Page d'accueil définissable
- [ ] Design : Thèmes cliquables
- [ ] Design : Couleurs modifiables
- [ ] Design : Polices modifiables
- [ ] Médias : Upload fonctionne
- [ ] Médias : Galerie s'affiche

### Temps réel

- [ ] Changement thème = instantané
- [ ] Changement couleur = instantané
- [ ] Changement police = instantané
- [ ] Pas de rechargement nécessaire

### Drag & Drop (comportement type Wix)

- [ ] Overlay bleu semi-transparent au drag enter
- [ ] Message principal "Déposez vos images ici"
- [ ] Sous-message "Elles seront ajoutées à votre médiathèque"
- [ ] Animation bounce/pulse sur l'icône
- [ ] Overlay disparaît au drop
- [ ] Upload automatique en arrière-plan
- [ ] Toast de succès "X images ajoutées..."
- [ ] Multi-images supporté
- [ ] Fichiers non-image ignorés
- [ ] Pas de popup bloquante

### Multipage

- [ ] Onglets de navigation visibles
- [ ] Navigation entre pages fonctionne
- [ ] Menu preview si >1 page
- [ ] Définir page d'accueil fonctionne
- [ ] Masquer page du menu fonctionne

### Site public

- [ ] Accessible sur /s/<slug>
- [ ] Menu navigation si multipage
- [ ] Navigation entre pages fonctionne
- [ ] Badge freemium si applicable
- [ ] 404 si non publié

### Persistance

- [ ] Données persistent après refresh
- [ ] Données persistent après restart Docker
- [ ] Médias uploadés persistent

---

## Tests Playwright (Smoke)

```typescript
// tests/smoke.spec.ts
import { test, expect } from '@playwright/test'

test.describe('OVHcloud Site Builder - Smoke Tests', () => {
  
  test('Logo OVHcloud dans header onboarding', async ({ page }) => {
    await page.goto('/onboarding')
    
    // Vérifier présence du logo
    const logo = page.locator('header a[href="https://www.ovhcloud.com"]')
    await expect(logo).toBeVisible()
    
    // Vérifier le SVG
    const svg = logo.locator('svg')
    await expect(svg).toBeVisible()
    
    // Vérifier target="_blank"
    await expect(logo).toHaveAttribute('target', '_blank')
  })

  test('Parcours complet avec modale accordéon', async ({ page }) => {
    // 1. Landing
    await page.goto('/')
    await page.click('text=Créer mon site')
    
    // 2. Onboarding
    await page.fill('input[name="name"]', 'Test Site')
    await page.fill('input[name="email"]', 'test@test.com')
    await page.click('text=Continuer')
    
    await page.click('text=Vitrine')
    await page.click('text=Continuer')
    
    // 3. Galerie thèmes
    await expect(page.locator('.theme-card')).toHaveCount(6)
    await page.click('.theme-card >> nth=0')
    await page.click('text=Continuer')
    
    await page.click('text=Continuer')
    await page.click('text=Créer mon site')
    
    // 4. Succès
    await expect(page).toHaveURL(/\/onboarding\/success/)
    await page.click('text=Accéder')
    
    // 5. Éditeur - Modale accordéon
    await page.click('[data-testid="menu-toggle"]')
    await expect(page.locator('.settings-modal')).toBeVisible()
    
    // Section Pages ouverte par défaut
    await expect(page.locator('text=Pages & Menu')).toBeVisible()
    
    // Ouvrir Design
    await page.click('text=Design du site')
    await expect(page.locator('.theme-preset')).toBeVisible()
    
    // Changer thème - temps réel
    await page.click('.theme-preset >> nth=2')
    // Vérifier que les couleurs ont changé (CSS custom property)
    
    // 6. Créer une page
    await page.click('text=Pages & Menu')
    await page.click('text=Ajouter une page')
    await page.fill('input[name="page-title"]', 'Services')
    await page.click('text=Créer')
    
    // Vérifier onglet apparu
    await expect(page.locator('button:has-text("Services")')).toBeVisible()
    
    // 7. Publier
    await page.click('[data-testid="menu-toggle"]') // Fermer modale
    await page.click('text=Publier')
    await expect(page.locator('.publish-success')).toBeVisible()
  })

  test('Drag & drop images - Overlay et messages', async ({ page }) => {
    // Setup: créer un site et accéder à l'éditeur
    // ...
    
    // Test drag enter
    const dataTransfer = await page.evaluateHandle(() => {
      const dt = new DataTransfer()
      dt.items.add(new File([''], 'test.png', { type: 'image/png' }))
      return dt
    })
    
    await page.dispatchEvent('.editor-zone', 'dragenter', { dataTransfer })
    
    // Vérifier overlay visible
    await expect(page.locator('.drag-overlay')).toBeVisible()
    
    // Vérifier message principal
    await expect(page.locator('text=Déposez vos images ici')).toBeVisible()
    
    // Vérifier sous-message
    await expect(page.locator('text=Elles seront ajoutées à votre médiathèque')).toBeVisible()
    
    // Vérifier animation bounce
    await expect(page.locator('.animate-bounce')).toBeVisible()
  })
  
  test('Drag & drop images - Upload et toast', async ({ page }) => {
    // Setup: créer un site et accéder à l'éditeur
    // ...
    
    // Simuler drop
    const dataTransfer = await page.evaluateHandle(() => {
      const dt = new DataTransfer()
      dt.items.add(new File(['fake-image-data'], 'test.png', { type: 'image/png' }))
      return dt
    })
    
    await page.dispatchEvent('.editor-zone', 'drop', { dataTransfer })
    
    // Vérifier overlay disparaît
    await expect(page.locator('.drag-overlay')).not.toBeVisible()
    
    // Vérifier toast de succès
    await expect(page.locator('text=image ajoutée')).toBeVisible({ timeout: 5000 })
  })

  test('Navigation multipage', async ({ page }) => {
    // Setup: créer un site avec plusieurs pages
    // ...
    
    // Vérifier onglets
    await expect(page.locator('.page-tab')).toHaveCount(3)
    
    // Naviguer
    await page.click('.page-tab >> nth=1')
    // Vérifier changement de contenu
    
    // Vérifier menu preview
    await expect(page.locator('.nav-preview')).toBeVisible()
  })
})
```

---

## Liste des erreurs bloquantes

| Erreur | Impact | Criticité |
|--------|--------|-----------|
| Token invalide non géré | Accès impossible | 🔴 Critique |
| Sauvegarde silencieuse échoue | Perte de données | 🔴 Critique |
| Thème temps réel ne fonctionne pas | UX dégradée | 🔴 Critique |
| Drag & drop bloqué | Feature cassée | 🟠 Haute |
| Modale ne s'ouvre pas | UX bloquée | 🟠 Haute |
| Onglets pages non cliquables | Navigation cassée | 🟠 Haute |
| Menu preview absent | Feature incomplète | 🟡 Moyenne |

---

## Recommandations

Si des erreurs sont détectées :

1. **Documenter** : Description, étapes reproduction, screenshot
2. **Classifier** : Critique / Haute / Moyenne / Basse
3. **Reporter** : À l'agent DEVELOPER (400) ou INTEGRATOR (500)
4. **Vérifier** : Après fix, retester le scénario complet

---

## Hors périmètre

- ❌ Pas de tests de charge
- ❌ Pas de tests unitaires exhaustifs
- ❌ Focus sur smoke tests et parcours critiques

---

## Livrables attendus

1. ✅ Scénarios de test documentés
2. ✅ Checklist de validation
3. ✅ Tests Playwright (smoke)
4. ✅ Liste des erreurs
5. ✅ Recommandations

---

*Dernière mise à jour : 2 février 2026*
