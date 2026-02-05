# Guide de Dépannage - Internal Server Error

## Vérifications rapides

### 1. Vérifier que le serveur est démarré
```bash
# Le serveur doit être lancé avec :
npm run dev
```

### 2. Vérifier l'endpoint de diagnostic
Ouvrez dans votre navigateur : **http://localhost:3000/api/debug**

Cela vous donnera des informations sur :
- La connexion à la base de données
- Les variables d'environnement
- L'état général du système

### 3. Vérifier les logs du serveur
Regardez la console où vous avez lancé `npm run dev`. Les erreurs détaillées y apparaissent.

## Erreurs courantes et solutions

### Erreur de validation Zod
**Symptôme** : Erreur 400 avec message "Validation error"

**Solution** : 
- Vérifiez que tous les champs requis sont remplis
- Vérifiez le format de l'email
- Vérifiez que `goal` est l'une des valeurs : `vitrine`, `portfolio`, `blog`, `ecommerce`

### Erreur de base de données
**Symptôme** : Erreur 500 avec message générique

**Solution** :
```bash
# Réinitialiser la base de données
npx prisma db push
```

### Erreur de parsing JSON
**Symptôme** : Erreur lors de l'affichage d'une section

**Solution** : Les données corrompues sont maintenant gérées automatiquement avec un fallback.

## Messages d'erreur améliorés

En mode développement, les erreurs incluent maintenant :
- Le message d'erreur détaillé
- La stack trace (pour les erreurs serveur)
- Les détails de validation (pour les erreurs Zod)

## Tester l'API directement

### Créer un site (test)
```bash
curl -X POST http://localhost:3000/api/sites \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Site",
    "contactEmail": "test@example.com",
    "goal": "vitrine",
    "themeFamily": "ovh-modern",
    "sections": [],
    "needs": []
  }'
```

### Vérifier la santé du système
```bash
curl http://localhost:3000/api/debug
```

## Si le problème persiste

1. **Vérifiez les logs complets** du serveur Next.js
2. **Ouvrez les DevTools** du navigateur (F12) et regardez l'onglet Console et Network
3. **Vérifiez l'endpoint /api/debug** pour le diagnostic système
4. **Redémarrez le serveur** : `Ctrl+C` puis `npm run dev`
