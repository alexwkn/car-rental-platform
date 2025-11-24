import vine from "vine";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateVehiculeSchema:
 *       type: object
 *       required:
 *         - model
 *         - licence_plate
 *         - owner_id
 *       properties:
 *         model:
 *           type: string
 *           example: "Peugeot 208"
 *         licence_plate:
 *           type: string
 *           example: "AB-123-CD"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Véhicule en excellent état"
 *         owner_id:
 *           type: integer
 *           example: 4
 */
export const createVehiculeSchema = vine.object({
  model: vine.string().trim().min(1).max(100).required(),
  licence_plate: vine.string().trim().min(1).max(20).required(),
  description: vine.string().optional(),
  owner_id: vine.number().integer().positive().required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateVehiculeSchema:
 *       type: object
 *       properties:
 *         model:
 *           type: string
 *           example: "Renault Megane"
 *         licence_plate:
 *           type: string
 *           example: "XY-987-ZZ"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Version sport"
 *         owner_id:
 *           type: integer
 *           example: 2
 */
export const updateVehiculeSchema = vine.object({
  model: vine.string().trim().min(1).max(100).optional(),
  licence_plate: vine.string().trim().min(1).max(20).optional(),
  description: vine.string().optional(),
  owner_id: vine.number().integer().positive().optional(),
});
