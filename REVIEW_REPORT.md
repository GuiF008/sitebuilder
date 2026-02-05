# Rapport de Revue du Projet SiteBuilder

**Date**: 5 février 2026  
**Objectif**: Détecter incohérences, duplications, dette technique et risques

---

## 1. INCOHÉRENCES

### 1.1 Gestion des erreurs API
**Problème**: Patterns incohérents de gestion d'erreurs dans les routes API
- **Localisation**: `app/api/**/*.ts`
- **Constats**:
  - Certaines routes utilisent `try/catch` avec `console.error` uniquement
  - Messages d'erreur génériques ("Failed to fetch site") sans détails
  - Pas de validation systématique des entrées
  - Pas de gestion d'erreurs Prisma spécifique (ex: contraintes uniques)
- **Exemples**:
  - `app/api/sites/[id]/pages/route.ts:32` : Pas de validation de `title` avant traitement
  - `app/api/sections/[id]/route.ts:14` : `data: body` accepte n'importe quel objet sans validation

### 1.2 Parsing JSON non sécurisé
**Problème**: Parsing de `dataJson` sans gestion d'erreurs
- **Localisation**: `app/edit/[token]/page.tsx`, `app/s/[slug]/page.tsx`
- **Constats**:
  - `JSON.parse(section.dataJson)` utilisé sans try/catch
  - Risque de crash si JSON invalide dans la base
  - Répété dans 10+ endroits
- **Exemples**:
  - `app/edit/[token]/page.tsx:908`
  - `app/s/[slug]/page.tsx:213`

### 1.3 Types de sectionStyles non centralisés
**Problème**: Définition dupliquée du type `sectionStyles`
- **Localisation**: `app/edit/[token]/page.tsx:792`, `app/s/[slug]/page.tsx:488`
- **Constats**:
  - Type défini inline dans chaque composant
  - Pas de type centralisé dans `lib/types.ts`
  - Risque d'incohérence lors de modifications

### 1.4 Validation des données d'entrée
**Problème**: Validation inconsistante dans les API
- **Localisation**: Routes API POST/PATCH
- **Constats**:
  - `app/api/sites/route.ts`: Validation minimale (pas de vérification email format)
  - `app/api/sites/[id]/pages/route.ts:34`: Pas de validation de `title` (peut être vide/null)
  - `app/api/sections/[id]/route.ts:14`: Accepte n'importe quel body sans validation

### 1.5 Gestion des fichiers uploadés
**Problème**: Validation de type MIME basique
- **Localisation**: `app/api/sites/[id]/media/route.ts:46`
- **Constats**:
  - Validation uniquement sur `file.type.startsWith()` (facilement contournable)
  - Pas de vérification réelle du contenu du fichier
  - Pas de sanitization du nom de fichier

---

## 2. DUPLICATIONS

### 2.1 Logique de rendu des sections
**Problème**: Code dupliqué entre éditeur et page publique
- **Localisation**: 
  - `app/edit/[token]/page.tsx:784-875` (BlockRenderer)
  - `app/s/[slug]/page.tsx:481-588` (PublicBlockRenderer)
- **Constats**:
  - ~90 lignes de code quasi-identiques
  - Seule différence: classes CSS (`rounded-ovh` vs `rounded-lg`)
  - Logique de fallback `sectionStyles` dupliquée
- **Impact**: Maintenance difficile, bugs potentiels si une version est modifiée sans l'autre

### 2.2 Rendu des sections par type
**Problème**: Logique de rendu dupliquée pour chaque type de section
- **Localisation**: 
  - `app/edit/[token]/page.tsx:940-1127` (SectionPreview)
  - `app/s/[slug]/page.tsx:234-456` (PublicSection)
- **Constats**:
  - Switch cases identiques pour hero, about, services, gallery, testimonials, contact
  - Application des `sectionStyles` répétée dans chaque case
  - ~300 lignes dupliquées

### 2.3 Calcul des styles de section
**Problème**: Logique de fallback répétée
- **Localisation**: 
  - `app/edit/[token]/page.tsx:921-928`
  - `app/s/[slug]/page.tsx:216-223`
- **Constats**:
  - Même objet de fallback défini 2 fois
  - Risque d'incohérence si valeurs par défaut changent

### 2.4 Gestion d'erreurs API
**Problème**: Pattern identique répété dans toutes les routes
- **Localisation**: Toutes les routes API
- **Constats**:
  - Même structure try/catch/console.error répétée 20+ fois
  - Messages d'erreur génériques identiques
  - Pas de helper function pour standardiser

### 2.5 Conversion anciennes données en blocs
**Problème**: Logique de migration dupliquée potentiellement
- **Localisation**: `components/editor/SectionEditorModal.tsx:70-95`
- **Constats**:
  - Conversion des anciennes structures (title, subtitle, image, etc.) en blocs
  - Si cette logique est nécessaire ailleurs, elle sera dupliquée

---

## 3. DETTE TECHNIQUE

### 3.1 Absence de validation de schéma
**Problème**: Pas de validation Zod/Yup pour les API
- **Constats**:
  - Données entrantes non validées structurellement
  - Risque de données corrompues en base
  - Pas de messages d'erreur clairs pour le client
- **Impact**: Bugs difficiles à déboguer, sécurité compromise

### 3.2 Gestion d'erreurs basique
**Problème**: `console.error` uniquement, pas de logging structuré
- **Constats**:
  - Pas de système de logging (Winston, Pino)
  - Erreurs non tracées en production
  - Pas de monitoring/alerting
- **Impact**: Difficulté à diagnostiquer les problèmes en production

### 3.3 Boucle infinie potentielle
**Problème**: `while(true)` sans limite de sécurité
- **Localisation**: `app/api/sites/[id]/pages/route.ts:55`
- **Constats**:
  - Boucle pour générer slug unique sans limite d'itérations
  - Risque théorique de boucle infinie si collision massive
- **Impact**: DoS potentiel si attaque ciblée

### 3.4 Pas de rate limiting
**Problème**: Aucune protection contre les abus
- **Constats**:
  - Routes API publiques sans limitation
  - Upload de fichiers sans quota
  - Création de sites illimitée
- **Impact**: Vulnérable aux attaques DoS, consommation ressources

### 3.5 Stockage fichiers local
**Problème**: Fichiers stockés dans `uploads/` sans gestion
- **Localisation**: `app/api/sites/[id]/media/route.ts:69`
- **Constats**:
  - Pas de nettoyage des fichiers orphelins
  - Pas de limite d'espace disque
  - Pas de CDN/storage externe
- **Impact**: Risque de saturation disque, pas scalable

### 3.6 Pas de transactions Prisma
**Problème**: Opérations multi-étapes sans transaction
- **Constats**:
  - `app/api/sites/route.ts`: Création site + pages + sections sans transaction
  - Risque d'état incohérent en cas d'erreur partielle
- **Impact**: Données corrompues possibles

### 3.7 Types TypeScript partiels
**Problème**: Utilisation de `Record<string, unknown>` et `any` implicite
- **Localisation**: 
  - `app/edit/[token]/page.tsx:790` (settings?: Record<string, unknown>)
  - `app/api/sections/[id]/route.ts:14` (data: body sans typage)
- **Constats**:
  - Perte de sécurité de type
  - Pas de validation à la compilation

### 3.8 Pas de tests
**Problème**: Aucun test unitaire ou d'intégration détecté
- **Constats**:
  - Pas de dossier `__tests__` ou `tests/`
  - Pas de configuration Jest/Vitest
  - Pas de tests E2E
- **Impact**: Refactoring risqué, régressions non détectées

### 3.9 Code mort / Commentaires
**Problème**: Code commenté ou inutilisé
- **Localisation**: `app/page.tsx:121` (fonction `handleSubmit` non fermée correctement)
- **Constats**:
  - Syntaxe incorrecte détectée (manque `}`)
  - Potentiel code mort non identifié

---

## 4. RISQUES

### 4.1 Sécurité

#### 4.1.1 Injection SQL
**Risque**: FAIBLE (Prisma protège)
- **Constats**: Utilisation de Prisma ORM qui prépare les requêtes
- **Note**: Risque réduit mais vigilance nécessaire

#### 4.1.2 XSS (Cross-Site Scripting)
**Risque**: MOYEN
- **Constats**:
  - `contentEditable` utilisé dans l'éditeur (`app/edit/[token]/page.tsx:920`)
  - Contenu utilisateur rendu sans sanitization explicite
  - React échappe par défaut mais `dangerouslySetInnerHTML` pourrait être utilisé
- **Impact**: Exécution de code malveillant sur les sites publics

#### 4.1.3 CSRF (Cross-Site Request Forgery)
**Risque**: MOYEN
- **Constats**:
  - Pas de protection CSRF sur les routes API
  - Tokens d'édition dans l'URL (exposés dans logs/historique)
- **Impact**: Modification non autorisée de sites

#### 4.1.4 Upload de fichiers malveillants
**Risque**: ÉLEVÉ
- **Constats**:
  - Validation MIME basique uniquement
  - Pas de scan antivirus
  - Fichiers servis directement depuis `/uploads/`
- **Impact**: Distribution de malware, phishing

#### 4.1.5 Exposition de tokens
**Risque**: MOYEN
- **Constats**:
  - Tokens dans URLs (`/edit/[token]`)
  - Tokens dans query params (`?token=xxx`)
  - Tokens visibles dans logs serveur
- **Impact**: Accès non autorisé aux sites

### 4.2 Performance

#### 4.2.1 N+1 Queries
**Risque**: MOYEN
- **Constats**:
  - `app/api/sites/by-token/route.ts:19` : Include profond mais vérifier les requêtes
  - Pas d'optimisation visible des requêtes Prisma
- **Impact**: Latence élevée avec beaucoup de données

#### 4.2.2 Pas de cache
**Risque**: MOYEN
- **Constats**:
  - Pas de cache HTTP (headers Cache-Control)
  - Pas de cache Redis/Memcached
  - Requêtes répétées pour mêmes données
- **Impact**: Charge serveur inutile, latence

#### 4.2.3 Images non optimisées
**Risque**: FAIBLE
- **Constats**:
  - Utilisation de `<img>` au lieu de Next.js `Image`
  - Pas de lazy loading systématique
  - Pas de formats modernes (WebP, AVIF)
- **Impact**: Temps de chargement élevé

### 4.3 Scalabilité

#### 4.3.1 Base de données SQLite
**Risque**: ÉLEVÉ
- **Constats**:
  - SQLite pour production (limite de concurrence)
  - Pas de réplication
  - Pas de sharding
- **Impact**: Limite de ~1000 requêtes/s, pas scalable

#### 4.3.2 Stockage fichiers local
**Risque**: ÉLEVÉ
- **Constats**:
  - Fichiers sur disque local
  - Pas de CDN
  - Pas de backup automatique
- **Impact**: Pas scalable, risque de perte de données

### 4.4 Maintenabilité

#### 4.4.1 Code dupliqué
**Risque**: MOYEN
- **Constats**: ~400 lignes dupliquées identifiées
- **Impact**: Bugs difficiles à corriger, maintenance coûteuse

#### 4.4.2 Pas de documentation API
**Risque**: FAIBLE
- **Constats**: Pas de Swagger/OpenAPI
- **Impact**: Intégration difficile pour nouveaux développeurs

#### 4.4.3 Types non exhaustifs
**Risque**: MOYEN
- **Constats**: Types partiels, `any` implicite
- **Impact**: Erreurs à l'exécution non détectées

### 4.5 Disponibilité

#### 4.5.1 Pas de health checks avancés
**Risque**: FAIBLE
- **Constats**: Route `/api/health` basique
- **Impact**: Monitoring limité

#### 4.5.2 Pas de retry logic
**Risque**: MOYEN
- **Constats**: Requêtes API sans retry automatique
- **Impact**: Échecs temporaires non récupérés

---

## 5. RECOMMANDATIONS PRIORITAIRES

### Priorité CRITIQUE
1. **Validation des entrées API** (Zod/Yup)
2. **Sanitization du contenu utilisateur** (XSS)
3. **Validation réelle des fichiers uploadés** (sécurité)
4. **Gestion d'erreurs JSON.parse** (stabilité)

### Priorité ÉLEVÉE
5. **Refactorisation du code dupliqué** (maintenabilité)
6. **Transactions Prisma** (intégrité données)
7. **Rate limiting** (sécurité)
8. **Logging structuré** (observabilité)

### Priorité MOYENNE
9. **Tests unitaires** (qualité)
10. **Migration vers PostgreSQL** (scalabilité)
11. **CDN pour fichiers** (performance)
12. **Cache HTTP** (performance)

---

## 6. MÉTRIQUES

- **Lignes de code dupliquées**: ~400 lignes identifiées
- **Routes API sans validation**: 15+ routes
- **Points de parsing JSON non sécurisés**: 10+
- **Types non centralisés**: 3+ définitions dupliquées
- **Boucles sans limite**: 1 (`while(true)`)
- **Tests**: 0 détectés

---

**Fin du rapport**
