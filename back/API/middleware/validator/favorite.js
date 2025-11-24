import vine from "vine";

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
export const createFavoriteSchema = vine.object({
  profile_id: vine.number().integer().positive().required(),
  vehicule_id: vine.number().integer().positive().required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateFavoriteSchema:
 *       type: object
 *       properties:
 *         profile_id:
 *           type: integer
 *           description: ID du profil
 *         vehicule_id:
 *           type: integer
 *           description: ID du véhicule
 */
export const updateFavoriteSchema = vine.object({
  profile_id: vine.number().integer().positive().optional(),
  vehicule_id: vine.number().integer().positive().optional(),
});
