# Location de Voiture - Projet BAC3

Application web de gestion de location de voitures avec un backend Node.js/Express et un frontend React.



## Configuration

Le fichier `.env` doit être présent à la racine du projet 



## Installation et démarrage

### 1. Démarrer l'application avec Docker

Ouvrez un terminal PowerShell dans le dossier racine du projet et exécutez :


docker compose up --build -d


Cette commande va :
- Construire les images Docker pour le backend et le frontend
- Créer un conteneur PostgreSQL pour la base de données
- Démarrer tous les services en arrière-plan



### 2. Initialiser la base de données

Une fois les conteneurs démarrés, initialisez la base de données avec les données de test :


docker compose exec back node scripts/JS/initDB.js


Vous devriez voir :

done
pool closed


### 3. Accéder à l'application

L'application est maintenant accessible :

- **Frontend** : [http://localhost:8080](http://localhost:8080)
- **Backend API** : [http://localhost:3001](http://localhost:3001)


### Comptes de test

#### Utilisateur administrateur (manager)
- **Email** : `admin@mail.com`
- **Mot de passe** : `adminpass`

#### Utilisateurs clients
- **Email** : `alex@mail.com` | **Mot de passe** : `password123`
- **Email** : `marie@mail.com` | **Mot de passe** : `securepass`
- **Email** : `lucas@mail.com` | **Mot de passe** : `pass1`


