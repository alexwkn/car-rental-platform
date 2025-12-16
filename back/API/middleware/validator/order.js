import vine from '@vinejs/vine'


/**
 * @swagger
 * components:
 *   schemas:
 *     OrderSchema:
 *       type: object
 *       required:
 *         - date_of_return
 *         - fuel_level_return
 *         - payment_status
 *         - offer_id
 *         - customer_id
 *       properties:
 *         order_date:
 *           type: string
 *           format: date-time
 *           example: "2025-02-01T10:00:00Z"
 *         date_of_return:
 *           type: string
 *           format: date
 *           example: "2025-02-10"
 *         fuel_level_return:
 *           type: number
 *           format: float
 *           example: 95.5
 *         payment_status:
 *           type: string
 *           enum: [pending, completed, failed]
 *           example: "pending"
 *         offer_id:
 *           type: integer
 *           example: 4
 *         customer_id:
 *           type: integer
 *           example: 2
 */


const OrderSchema = vine
.object({
 order_date: vine
    .date({
    formats: ['iso8601']
  })
    .afterOrEqual('today')// order_date >= today          
    .optional(), 
  date_of_return: vine
    .date({
    formats: ['iso8601']
  })
    .afterField('order_date'),        // date_of_return > order_date 

  fuel_level_return: vine
    .number()
    .decimal([0,2])                       
    .min(0)
    .max(999.99),

  payment_status: vine.enum(['pending','completed','failed']),

  offer_id: vine.number().withoutDecimals().positive(),    // entier positif (obligatoire)
  customer_id: vine.number().withoutDecimals().positive(), // entier positif (obligatoire)
});


export const OrderValidator = vine.compile(OrderSchema);
