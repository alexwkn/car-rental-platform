import vine from "vine";

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
export const createReviewSchema = vine.object({
  rating: vine.number().integer().min(1).max(5).optional(),
  comment: vine.string().max(250).optional(),
  review_date: vine.date().optional(),
  customer_id: vine.number().integer().positive().required(),
  renter_id: vine.number().integer().positive().required(),
  order_id: vine.number().integer().positive().required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateReviewSchema:
 *       type: object
 *       properties:
 *         rating:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         comment:
 *           type: string
 *           nullable: true
 *           example: "Service impeccable, je recommande."
 *         review_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "2025-02-01"
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
export const updateReviewSchema = vine.object({
  rating: vine.number().integer().min(1).max(5).optional(),
  comment: vine.string().max(250).optional(),
  review_date: vine.date().optional(),
  customer_id: vine.number().integer().positive().optional(),
  renter_id: vine.number().integer().positive().optional(),
  order_id: vine.number().integer().positive().optional(),
});
