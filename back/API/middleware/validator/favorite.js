import vine from '@vinejs/vine'

/**
 * @swagger
 * components:
 *   schemas:
 *     FavoriteSchema:
 *       type: object
 *       required:
 *         - profile_id
 *         - vehicule_id
 *       properties:
 *         profile_id:
 *           type: integer
 *           example: 3
 *         vehicule_id:
 *           type: integer
 *           example: 12
 */




const FavoriteSchema = vine.object({
  profile_id: vine.number().withoutDecimals().positive(), // entier positif (obligatoire)
  vehicule_id: vine.number().withoutDecimals().positive(), // entier positif (obligatoire)
}); 

export const FavoriteValidator = vine.compile(FavoriteSchema);