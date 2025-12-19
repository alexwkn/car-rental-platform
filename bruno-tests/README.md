Key2Go API - Bruno Test Collection

## Ordre d'exécution des tests

### 1. Authentication (Obligatoire en premier)

Exécuter **"Login - Admin"** pour obtenir le token JWT.
Le token doit ensuite être copié collé dans la variable token dans le fichier Local.bru du code.

Chemin : locationVoiture\bruno-test\environements\Local.bru

Les autres variables sont incrémentés avec des ID valides déjà enregistrés dans la base de données.

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

Les variables suivantes sont déjà préremplit exepté la variable token :

- `token` : JWT obtenu après login
- `profileId` : ID valide
- `vehiculeId` : ID valide
- `offerId` : ID valide
- `orderId` : ID valide
- `reviewId` : ID valide
- `favoriteId` : ID valide

# Admin (log)

```json
{
  "email": "admin@mail.com",
  "password": "adminpass"
}
```

# Utilisateur normal (log)

```json
{
  "email": "john.doe@mail.com",
  "password": "johnpass"
}
```
