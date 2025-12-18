Key2Go API - Bruno Test Collection

## Ordre d'exécution des tests

### 1. Authentication (Obligatoire en premier)

Exécuter **"Login - Admin"** pour obtenir le token JWT.
Le token est automatiquement sauvegardé dans les variables d'environnement. {{token}}

### 2. Profiles

Tous les tests CRUD pour les profils utilisateurs.

### 3. Vehicules

Tests complets pour la gestion des véhicules.

### 4. Offers

Tests pour les offres de location.

### 5. Orders

Tests pour les commandes.

### 6. Reviews

Tests pour les avis clients.

### 7. Favorites

Tests pour les favoris.

### 8. Security Tests

Tests de sécurité (token invalide, pas de token).

# Environnements

baseUrl: http://localhost:3001

# Variables d'environnement

Les variables suivantes sont automatiquement mises à jour lors de l'exécution :

- `token` : JWT obtenu après login
- `profileId` : ID du dernier profile créé
- `vehiculeId` : ID du dernier véhicule créé
- `offerId` : ID de la dernière offre créée
- `orderId` : ID de la dernière commande créée
- `reviewId` : ID du dernier avis créé
- `favoriteId` : ID du dernier favori créé

# Admin (Manager)

```json
{
  "email": "admin@mail.com",
  "password": "adminpass"
}
```

# Utilisateur normal

```json
{
  "email": "john.doe@mail.com",
  "password": "johnpass"
}
```
