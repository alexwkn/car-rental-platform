import vine from '@vinejs/vine'

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

const VehiculeSchema = vine.object({
  model: vine.string().minLength(1).maxLength(100),
  licence_plate: vine.string().minLength(1).maxLength(20),
  description: vine.string().maxLength(500).optional().nullable(),
  owner_id: vine.number().withoutDecimals().positive(),
});

export const VehiculeValidator = vine.compile(VehiculeSchema);