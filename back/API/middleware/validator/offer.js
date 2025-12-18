import vine from "@vinejs/vine"

/**
 * @swagger
 * components:
 *   schemas:
 *     OfferSchema:
 *       type: object
 *       required:
 *         - start_date
 *         - end_date
 *         - fuel_level
 *         - adress
 *         - price
 *         - vehicule_id
 *       properties:
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2025-01-10"
 *         end_date:
 *           type: string
 *           format: date
 *           example: "2025-01-15"
 *         fuel_level:
 *           type: number
 *           format: float
 *           example: 75.5
 *         adress:
 *           type: string
 *           example: "Rue du Centre 100, Namur"
 *         price:
 *           type: number
 *           format: float
 *           example: 120.00
 *         description:
 *           type: string
 *           example: "Petite voiture économique"
 *         vehicule_id:
 *           type: integer
 *           example: 1
 */


const OfferSchema = vine
.object({
  start_date: vine
    .date({ formats: ['yyyy-MM-dd','iso8601'] })
    .optional(),
  end_date: vine
    .date({ formats: ['yyyy-MM-dd','iso8601'] })
    .afterField('start_date'), // end_date > start_date

  fuel_level: vine
    .number()
    .decimal([0,2])
    .min(0)
    .max(100),
  adress: vine.string().maxLength(255),
  price: vine
    .number()
    .decimal([0,2])
    .positive(),
  description: vine.string().maxLength(1000).optional(),
  vehicule_id: vine.number().withoutDecimals().positive(), // entier positif (obligatoire)
});

export const OfferValidator = vine.compile(OfferSchema);

