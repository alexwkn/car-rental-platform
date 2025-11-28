import vine from '@vinejs/vine'

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProfileSchema:
 *       type: object
 *       properties:
 *         profile_id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         adress:
 *           type: string
 *         bank_account:
 *           type: string
 *         is_renter:
 *           type: boolean
 *         profile_picture:
 *           type: string
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