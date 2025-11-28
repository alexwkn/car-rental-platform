import vine from '@vinejs/vine'

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateFavoriteSchema:
 *       type: object
 *       properties:
 *         favorite_id:
 *           type: integer
 *         profile_id:
 *           type: integer
 *           description: ID du profil
 *         vehicule_id:
 *           type: integer
 *           description: ID du véhicule
 */

const FavoriteSchema = vine.object({
  profile_id: vine.number().withoutDecimals().positive(), // entier positif (obligatoire)
  vehicule_id: vine.number().withoutDecimals().positive(), // entier positif (obligatoire)
}); 

export const FavoriteValidator = vine.compile(FavoriteSchema);