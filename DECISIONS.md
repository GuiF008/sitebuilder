# DECISIONS.md — Journal des décisions

Ce fichier trace toutes les décisions prises lors du développement du projet.

---

## Format

```
### [DATE] Décision #XX : Titre
**Contexte** : Pourquoi cette décision a été nécessaire
**Options considérées** :
1. Option A
2. Option B
**Décision** : Option choisie et justification
**Impact** : Conséquences sur le projet
```

---

## Décisions

### [2026-02-03] Décision #001 : Structure du projet

**Contexte** : Initialisation du projet, choix de la structure des dossiers

**Options considérées** :
1. Structure standard Next.js avec `src/`
2. Structure racine avec `app/` directement

**Décision** : Option 2 — Structure racine Next.js 14 standard
- Plus simple et conforme aux conventions Next.js 14
- Pas de nesting inutile

**Impact** : Structure de fichiers clarifiée dès le départ

---

### [2026-02-03] Décision #002 : Largeur modale accordéon

**Contexte** : Défini dans les specs comme 420px fixe

**Options considérées** :
1. 420px fixe (comme spécifié)
2. Responsive (300-500px selon écran)

**Décision** : Option 1 — 420px fixe
- Conforme au MASTER_PROMPT
- Pas d'ambiguïté de rendu

**Impact** : Aucune adaptation responsive sur la modale

---

### [2026-02-03] Décision #003 : Logo OVHcloud dans header onboarding

**Contexte** : Demande produit d'ajouter le logo OVHcloud en haut à droite du header de l'onboarding, conforme à la charte graphique officielle

**Options considérées** :
1. Logo SVG inline (simple, pas de dépendance externe)
2. Image externe depuis CDN OVHcloud
3. Composant logo réutilisable

**Décision** : Option 1 — Logo SVG inline conforme à la charte graphique
- Pas de dépendance externe
- Contrôle total sur le rendu
- Performance optimale (pas de requête HTTP)
- Cohérent avec le design system OVHcloud
- Logo cliquable vers ovhcloud.com
- Référence : https://zeroheight.com/6fc8a63f7/p/394306-welcome-to-the-brand-hub

**Impact** : Logo visible sur toutes les étapes de l'onboarding, renforce la marque OVHcloud et respecte la charte graphique officielle

---

### [2026-02-03] Décision #004 : Comportement Drag & Drop type Wix

**Contexte** : Enrichissement des spécifications Drag & Drop pour une expérience utilisateur optimale, sans configuration ni compréhension technique requise

**Options considérées** :
1. Drag & Drop basique (overlay simple)
2. Comportement type Wix (overlay + messages + animation + toast)
3. Modal de configuration à l'upload

**Décision** : Option 2 — Comportement type Wix
- Overlay bleu semi-transparent au drag enter
- Message principal : "Déposez vos images ici"
- Sous-message : "Elles seront ajoutées à votre médiathèque"
- Animation bounce sur l'icône
- Toast de confirmation discret
- Multi-fichiers supporté
- Upload parallèle en arrière-plan
- Pas de popup bloquante

**Critères d'acceptance** :
- [ ] Overlay visible au drag
- [ ] Message + sous-message affichés
- [ ] Animation active
- [ ] Upload déclenché au drop
- [ ] Notification de succès affichée

**Impact** : UX fluide et intuitive, aucune friction pour l'utilisateur non technique

---

*À compléter au fil du projet*
