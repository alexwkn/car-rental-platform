import vine from '@vinejs/vine'

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProfileSchema:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - is_renter
 *       properties:
 *         name:
 *           type: string
 *           example: "Antoine Nguyen"
 *         email:
 *           type: string
 *           example: "antoine@mail.com"
 *         password:
 *           type: string
 *           example: "SuperPass123"
 *         adress:
 *           type: string
 *           example: "Rue des Fleurs 12, Namur"
 *         bank_account:
 *           type: string
 *           example: "BE12 3456 7890 1234"
 *         is_renter:
 *           type: boolean
 *           example: true
 *         profile_picture:
 *           type: string
 *           format: url
 *           example: "https://cdn.key2go.com/profiles/default.png"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfileSchema:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Nouveau Nom"
 *         email:
 *           type: string
 *           example: "nouvel-email@mail.com"
 *         password:
 *           type: string
 *           example: "NewPass789"
 *         adress:
 *           type: string
 *           example: "Nouvelle adresse"
 *         bank_account:
 *           type: string
 *           example: "BE98 7654 3210 9876"
 *         is_renter:
 *           type: boolean
 *           example: false
 *         profile_picture:
 *           type: string
 *           example: "https://cdn.key2go.com/profiles/updated.png"
 */


const ProfileSchema = vine
  .object({
    name: vine.string().maxLength(100),
    email: vine.string().email().maxLength(255),
    password: vine.string().minLength(8).maxLength(255),
    adress: vine.string().maxLength(255).optional(),
    bank_account: vine.string().maxLength(50).optional(),
    is_renter: vine.boolean(),
    profile_picture: vine.string().url().maxLength(500).optional(),
  });

export const ProfileValidator = vine.compile(ProfileSchema);