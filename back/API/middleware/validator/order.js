import vine from '@vinejs/vine'


/**
* @swagger
* components:
*   schemas:
*     OrderSchema:
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
