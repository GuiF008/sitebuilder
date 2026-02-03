# Guide de déploiement VPS

Ce guide explique comment déployer OVHcloud Site Builder sur un VPS.

## Prérequis

- VPS Ubuntu 22.04+ (ou Debian 12+)
- 1 GB RAM minimum
- Docker et Docker Compose installés
- Nom de domaine pointant vers le VPS
- Ports 80 et 443 ouverts

## 1. Préparation du serveur

### Connexion SSH

```bash
ssh user@votre-vps-ip
```

### Mise à jour système

```bash
sudo apt update && sudo apt upgrade -y
```

### Installation Docker

```bash
# Installation rapide
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker

# Vérification
docker --version
docker compose version
```

## 2. Installation de l'application

### Cloner le projet

```bash
cd /opt
sudo git clone <repo-url> sitebuilder
cd sitebuilder
sudo chown -R $USER:$USER .
```

### Configuration

```bash
# Copier la configuration exemple (si nécessaire)
cp .env.example .env
```

### Build et lancement

```bash
# Build et démarrage
docker compose up -d --build

# Vérifier le statut
docker compose ps

# Voir les logs
docker compose logs -f app
```

### Vérification

```bash
# Test local
curl http://localhost:3000/api/health
# Doit retourner: {"status":"ok","timestamp":"..."}
```

## 3. Configuration Caddy (Reverse Proxy + SSL)

### Installation

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### Configuration

```bash
sudo nano /etc/caddy/Caddyfile
```

Contenu :

```
sitebuilder.votre-domaine.com {
    reverse_proxy localhost:3000

    encode gzip

    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
    }
}
```

### Activation

```bash
sudo systemctl reload caddy
sudo systemctl status caddy
```

Le SSL sera automatiquement provisionné par Caddy.

## 4. Commandes de maintenance

### Logs

```bash
# Logs de l'application
docker compose logs -f app

# Logs Caddy
sudo journalctl -u caddy -f
```

### Redémarrage

```bash
# Redémarrer l'application
docker compose restart

# Redémarrer Caddy
sudo systemctl restart caddy
```

### Mise à jour

```bash
cd /opt/sitebuilder

# Récupérer les dernières modifications
git pull

# Rebuild et redémarrage
docker compose up -d --build
```

### Sauvegarde

```bash
# Sauvegarder les données
docker cp sitebuilder-app:/app/data ./backup/data
docker cp sitebuilder-app:/app/uploads ./backup/uploads

# Restaurer
docker cp ./backup/data sitebuilder-app:/app/
docker cp ./backup/uploads sitebuilder-app:/app/
```

## 5. Surveillance

### Vérifier l'état

```bash
# Santé de l'application
curl https://sitebuilder.votre-domaine.com/api/health

# État des containers
docker compose ps

# Utilisation ressources
docker stats sitebuilder-app
```

### Configurer une alerte (optionnel)

Ajouter un cron pour vérifier la santé :

```bash
crontab -e
```

Ajouter :

```
*/5 * * * * curl -sf https://sitebuilder.votre-domaine.com/api/health || echo "Site Builder down" | mail -s "Alerte" admin@example.com
```

## Dépannage

### L'application ne démarre pas

```bash
# Voir les logs détaillés
docker compose logs app

# Vérifier que le port n'est pas utilisé
sudo lsof -i :3000
```

### Problème de SSL

```bash
# Vérifier Caddy
sudo systemctl status caddy
sudo journalctl -u caddy --since "1 hour ago"

# Forcer le renouvellement
sudo caddy reload
```

### Base de données corrompue

```bash
# Sauvegarder puis réinitialiser
docker cp sitebuilder-app:/app/data ./backup-corrupt
docker compose down -v
docker compose up -d --build
```

## Architecture de production recommandée

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Internet  │────▶│    Caddy    │────▶│   Docker    │
│             │     │   (SSL)     │     │   App:3000  │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │   Volumes   │
                                        │  data/      │
                                        │  uploads/   │
                                        └─────────────┘
```

---

*Documentation OVHcloud Site Builder v2 — Février 2026*
