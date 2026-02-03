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

*À compléter au fil du projet*
