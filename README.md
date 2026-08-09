# Location de Voiture - Projet BAC3

Application web de gestion de location de voitures avec un backend Node.js/Express et un frontend React.

## Configuration

Le fichier `.env` doit être présent à la racine du projet 

## Installation et démarrage

### Démarrer l'application avec Docker

Ouvrez un terminal PowerShell dans le dossier racine du projet et exécutez :

```bash
docker compose up 
```

Cette commande unique va :
- Construire les images Docker pour le backend, le frontend et le mobile
- Créer un conteneur PostgreSQL pour la base de données
- Initialiser automatiquement la base avec les données de test au premier démarrage
- Démarrer tous les services en arrière-plan

### Accéder à l'application

L'application est maintenant accessible :

- **Frontend** : [http://localhost:8080](http://localhost:8080)
- **Backend API** : [http://localhost:3001/api/v1](http://localhost:3001/api/v1)
- **Mobile** : Via expo

### Comptes de test

#### Utilisateur administrateur (manager)
- **Email** : `admin@mail.com`
- **Mot de passe** : `adminpass`

#### Utilisateurs clients
- **Email** : `alex@mail.com` | **Mot de passe** : `password123`
- **Email** : `marie@mail.com` | **Mot de passe** : `securepass`
- **Email** : `lucas@mail.com` | **Mot de passe** : `pass1`


