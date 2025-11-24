import vine from "vine";

/**
* @swagger
* components:
*   schemas:
*     CreateOrderSchema:
*       type: object
*       properties:
*         order_id:
*           type: integer
*         order_date:
*           type: string
*           format: date-time
*         date_of_return:
*           type: string
*           format: date-time
*         fuel_level_return:
*           type: number
*           format: float
*         payment_status:
*           type: string
*         offer_id:
*           type: integer
*         customer_id:
*           type: integer
*/
export const createOrderSchema = vine
  .object({
    order_date: vine.date().optional(),
    date_of_return: vine.date().optional(),
    fuel_level_return: vine.number().decimal([2]).min(0).max(999.99).optional(),
    payment_status: vine.enum(["pending", "completed", "failed"]).optional(),
    offer_id: vine.number().integer().positive().required(),
    customer_id: vine.number().integer().positive().required(),
  })
  .refine((data, field) => {
    const start = new Date(data.order_date);
    const end = new Date(data.date_of_return);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      field.report("order_date cannot be before today", "start_date_in_past");
    }

    if (start >= end) {
      field.report(
        "order_date must be before date_of_return",
        "invalid_date_range"
      );
    }
  });


/**
* @swagger
* components:
*   schemas:
*     UpdateOrderSchema:
*       type: object
*       properties:
*         order_date:
*           type: string
*           format: date-time
*         date_of_return:
*           type: string
*           format: date-time
*         fuel_level_return:
*           type: number
*           format: float
*         payment_status:
*           type: string
*         offer_id:
*           type: integer
*         customer_id:
*           type: integer
*/
export const updateOrderSchema = vine
  .object({
    order_date: vine.date().optional(),
    date_of_return: vine.date().optional(),
    fuel_level_return: vine.number().decimal([2]).min(0).max(999.99).optional(),
    payment_status: vine.enum(["pending", "completed", "failed"]).optional(),
    offer_id: vine.number().integer().positive().optional(),
    customer_id: vine.number().integer().positive().optional(),
  })
  .refine((data, field) => {
    if (data.order_date && data.date_of_return) {
      const start = new Date(data.order_date);
      const end = new Date(data.date_of_return);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        field.report("order_date cannot be before today", "start_date_in_past");
      }

      if (start >= end) {
        field.report(
          "order_date must be before date_of_return",
          "invalid_date_range"
        );
      }
    }
  });
