import vine from "vine";

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
export const createOfferSchema = vine
  .object({
    start_date: vine.date().required(),
    end_date: vine.date().required(),

    fuel_level: vine.number().decimal([2]).min(0).max(999.99).optional(),
    adress: vine.string().optional(),
    price: vine.number().decimal([2]).min(0).max(99999999.99).required(),
    description: vine.string().optional(),
    vehicule_id: vine.number().integer().positive().required(),
  })
  .refine((data, field) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      field.report("start_date cannot be before today", "start_date_in_past");
    }

    if (start >= end) {
      field.report("start_date must be before end_date", "invalid_date_range");
    }
  });


  /**
* @swagger
* components:
*   schemas:
*     UpdateOfferSchema:
*       type: object
*       properties:
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
export const updateOfferSchema = vine
  .object({
    start_date: vine.date().optional(),
    end_date: vine.date().optional(),

    fuel_level: vine.number().decimal([2]).min(0).max(999.99).optional(),
    adress: vine.string().optional(),
    price: vine.number().decimal([2]).min(0).max(99999999.99).required(),
    description: vine.string().optional(),
    vehicule_id: vine.number().integer().positive().optional(),
  })
  .refine((data, field) => {
    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        field.report("start_date cannot be before today", "start_date_in_past");
      }

      if (start >= end) {
        field.report(
          "start_date must be before end_date",
          "invalid_date_range"
        );
      }
    }
  });
