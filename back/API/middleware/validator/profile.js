import vine from "vine";

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
export const createProfileSchema = vine.object({
  name: vine.string().trim().min(2).max(255).required(),
  email: vine.string().email().max(100).required(),
  password: vine.string().min(6).max(255).required(),
  adress: vine.string().optional(),
  bank_account: vine.string().max(50).optional(),
  is_renter: vine.boolean().optional(),
  profile_picture: vine.string().optional(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfileSchema:
 *       type: object
 *       properties:
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
export const updateProfileSchema = vine.object({
  name: vine.string().trim().min(2).max(255).optional(),
  email: vine.string().email().max(100).optional(),
  password: vine.string().min(6).max(255).optional(),
  adress: vine.string().optional(),
  bank_account: vine.string().max(50).optional(),
  is_renter: vine.boolean().optional(),
  profile_picture: vine.string().optional(),
});
