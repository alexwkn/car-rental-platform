import vine from '@vinejs/vine'

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateReviewSchema:
 *       type: object
 *       required:
 *         - rating
 *         - customer_id
 *         - renter_id
 *         - order_id
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         comment:
 *           type: string
 *           nullable: true
 *           example: "Très bonne expérience"
 *         review_date:
 *           type: string
 *           format: date
 *           example: "2025-03-01"
 *         customer_id:
 *           type: integer
 *           example: 2
 *         renter_id:
 *           type: integer
 *           example: 7
 *         order_id:
 *           type: integer
 *           example: 10
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateReviewSchema:
 *       type: object
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comment:
 *           type: string
 *           nullable: true
 *           example: "Mise à jour : service excellent"
 *         review_date:
 *           type: string
 *           format: date
 *           example: "2025-03-05"
 *         customer_id:
 *           type: integer
 *           example: 2
 *         renter_id:
 *           type: integer
 *           example: 1
 *         order_id:
 *           type: integer
 *           example: 10
 */

const ReviewSchema = vine.object({
  rating: vine.number().withoutDecimals().min(1).max(5),
  comment: vine.string().maxLength(1000).optional().nullable(),
  review_date: vine
    .date({
      formats: ['iso8601']
    }).afterOrEqual('today').
    optional(),
  customer_id: vine.number().withoutDecimals().positive(),
  renter_id: vine.number().withoutDecimals().positive(),
  order_id: vine.number().withoutDecimals().positive(),
});

export const ReviewValidator = vine.compile(ReviewSchema);