import vine from '@vinejs/vine'

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateReviewSchema:
 *       type: object
 *       required:
 *         - customer_id
 *         - renter_id
 *         - order_id
 *       properties:
 *         rating:
 *           type: integer
 *           nullable: true
 *           example: 4
 *         comment:
 *           type: string
 *           nullable: true
 *           example: "Très bon service"
 *         review_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "2025-01-15"
 *         customer_id:
 *           type: integer
 *           example: 3
 *         renter_id:
 *           type: integer
 *           example: 7
 *         order_id:
 *           type: integer
 *           example: 12
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