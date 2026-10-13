# Location de voitures – API, back-office web et application mobile

Projet de groupe réalisé en 3e année de Bachelier en développement d'applications (Henallux, 2025-2026).

Plateforme de location de voitures composée d'une API REST, d'un back-office web et d'une application mobile (**Key2Go**) :

| Module | Rôle | Technologies |
|---|---|---|
| `back/` | API REST (authentification JWT, CRUD, upload d'images) | Node.js 20, Express, Prisma, PostgreSQL, VineJS, Argon2, Winston |
| `front/` | Back-office web pour les gestionnaires | React, Vite, React Router, Axios |
| `Key2Go/` | Application mobile **Key2Go** pour les clients (carte, réservations, avis) | React Native, Expo, Redux Toolkit, React Native Maps |
| `bruno-tests/` | Collection de tests de l'API | [Bruno](https://www.usebruno.com/) |

## Fonctionnalités

- Inscription et connexion (JWT en cookie / SecureStore, mots de passe hachés avec Argon2 + pepper)
- Gestion des rôles : client et gestionnaire (manager)
- Gestion des véhicules, des offres de location, des réservations, des avis et des favoris
- Carte des véhicules disponibles et géolocalisation (mobile)
- Upload et redimensionnement des photos de profil (Multer + Sharp)
- Back-office avec tableaux paginés, recherche, édition et suppression
- Mode sombre sur l'application mobile
- Initialisation automatique de la base de données avec des données de test

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (avec Docker Compose)
- Pour le mobile : l'application **Expo Go** sur un téléphone, ou un émulateur Android/iOS

## Démarrage rapide

```bash
# 1. Cloner le dépôt
git clone https://github.com/alexwkn/locationVoiture.git
cd locationVoiture

# 2. Créer les fichiers d'environnement à partir des modèles
cp .env.example .env
cp Key2Go/.env.example Key2Go/.env
```

Sous Windows (PowerShell), remplacer `cp` par `Copy-Item`.

3. Ouvrir `.env` et remplacer les valeurs `change_me` (le mot de passe doit être identique dans `DB_PASSWORD` et `DATABASE_URL`).
4. Ouvrir `Key2Go/.env` et remplacer `192.168.x.x` par l'adresse IP locale de votre ordinateur.

```bash
# 5. Lancer tous les services
docker compose up --build
```

Au premier démarrage, Docker construit les images, crée la base PostgreSQL et l'initialise avec les données de test.

Pour lancer uniquement l'API et le back-office (sans le mobile) :

```bash
docker compose up --build db back front
```

## Accès

| Service | URL |
|---|---|
| Back-office web | http://localhost:8080 |
| API REST | http://localhost:3001/api/v1 |
| Application mobile | Scanner le QR code affiché dans les logs du conteneur `mobile` avec Expo Go |

La spécification OpenAPI de l'API se trouve dans `back/swagger/spec.json` (consultable sur [editor.swagger.io](https://editor.swagger.io/)).

## Comptes de test

Ces comptes sont créés automatiquement par le script d'initialisation (données fictives).

| Rôle | Email | Mot de passe |
|---|---|---|
| Gestionnaire | `admin@mail.com` | `adminpass` |
| Client | `alex@mail.com` | `password123` |
| Client | `marie@mail.com` | `securepass` |
| Client | `lucas@mail.com` | `pass1` |

## Tester l'API avec Bruno

1. Ouvrir Bruno, puis **Open Collection** et sélectionner le dossier `bruno-tests/`.
2. Choisir l'environnement **Local**.
3. Exécuter d'abord **1. Authentication > Login - Admin** : le token JWT est enregistré automatiquement.
4. Lancer les autres requêtes ou toute la collection (**Run**).

Plus de détails dans [`bruno-tests/README.md`](bruno-tests/README.md).

## Lancer sans Docker (développement)

PostgreSQL doit tourner localement et `DB_HOST` / `DATABASE_URL` doivent pointer vers `localhost`.

```bash
# API
cd back
npm install
npx prisma generate
npm run initDB   # crée les tables et insère les données de test
npm run dev      # http://localhost:3001

# Back-office
cd front
npm install
npm run dev      # http://localhost:5173

# Mobile
cd Key2Go
npm install
npx expo start
```

## Structure du projet

```
.
├── back/          # API Express (routes, contrôleurs, middlewares, Prisma)
├── front/         # Back-office React + Vite
├── Key2Go/        # Application mobile Expo
├── bruno-tests/   # Collection de tests de l'API
├── compose.yml    # Orchestration Docker (db, back, front, mobile)
└── .env.example   # Modèle de configuration
```

## Auteurs

- Alexandre Wenkin – [@alexwkn](https://github.com/alexwkn)
- Antoine-Vi Son Nguyen – [@Drastae](https://github.com/Drastae)
- Nathan Feltesse – [@NathFELT](https://github.com/NathFELT)
