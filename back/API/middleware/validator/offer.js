import vine from "@vinejs/vine"

/**
* @swagger
* components:
*   schemas:
*     CreateOfferSchema:
*       type: object
*       properties:
*         offer_id:
*           type: integer
*         start_date:
*           type: string
*           format: date-time
*         end_date:
*           type: string
*           format: date-time
*         fuel_level:
*           type: number
*           format: float
*         adress:
*           type: string
*         price:
*           type: number
*           format: float
*         description:
*           type: string
*         vehicule_id:
*           type: integer
*           description: ID du véhicule lié
*/
const OfferSchema = vine
.object({
  start_date: vine
    .date({
    formats: ['iso8601']
  })
    .afterOrEqual('today'), // start_date >= today
  end_date: vine
    .date({
    formats: ['iso8601']
  })
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

