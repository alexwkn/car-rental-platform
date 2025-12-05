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
 *           example: "1-ABC-234"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Véhicule propre, entretien OK"
 *         owner_id:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateVehiculeSchema:
 *       type: object
 *       properties:
 *         model:
 *           type: string
 *           example: "Renault Clio"
 *         licence_plate:
 *           type: string
 *           example: "2-ZYX-987"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Mise à jour : nouveau contrôle technique"
 *         owner_id:
 *           type: integer
 *           example: 3
 */


const VehiculeSchema = vine.object({
  model: vine.string().minLength(1).maxLength(100),
  licence_plate: vine.string().minLength(1).maxLength(20),
  description: vine.string().maxLength(500).optional().nullable(),
  owner_id: vine.number().withoutDecimals().positive(),
});

export const VehiculeValidator = vine.compile(VehiculeSchema);