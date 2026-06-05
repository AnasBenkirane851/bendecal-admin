# Bendecal Admin

Application Angular 18 interne pour gérer le catalogue (kits) et consulter les commandes de la boutique [Bendecal](../bendecal/).

## Prérequis

- Node.js 18+
- API Spring Boot en cours d’exécution ([bendecal-api](../bendecal-api/)) sur `http://localhost:8080`
- CORS : l’API autorise déjà `http://localhost:4201` (voir README de l’API)

## Configuration

| Environnement | API | Boutique (aperçu) | CDN |
|---------------|-----|-------------------|-----|
| dev (`environment.ts`) | `http://localhost:8080/api/v1` | `http://localhost:4200` | `https://cdn.bendecal.com` |
| prod (`environment.prod.ts`) | `https://api.bendecal.com/api/v1` | `https://bendecal.com` | `https://cdn.bendecal.com` |

## Démarrage

```bash
npm install
npm start
```

L’admin écoute sur **http://localhost:4201** (`ng serve --port 4201`).

## Identifiants admin (développement)

Voir le README de [bendecal-api](../bendecal-api/README.md) :

- Email : `admin@bendecal.com`
- Mot de passe : `changeme` (seed Flyway par défaut)

## Fonctionnalités

- Connexion JWT (`sessionStorage`), routes protégées, intercepteur `Authorization: Bearer`
- Dashboard : statistiques kits / featured / commandes récentes
- CRUD kits (liste, création, édition, suppression, upload images R2 via presign)
- Commandes en lecture seule (liste + détail)

## Build production

```bash
npm run build
```

Les artefacts sont dans `dist/bendecal-admin/`.
