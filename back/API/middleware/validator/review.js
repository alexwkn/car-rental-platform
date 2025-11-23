import vine from "vine";

// Validation pour review
export const createReviewSchema = vine.object({
  rating: vine.number().integer().min(1).max(5).optional(),
  comment: vine.string().max(250).optional(),
  review_date: vine.date().optional(),
  customer_id: vine.number().integer().positive().required(),
  renter_id: vine.number().integer().positive().required(),
  order_id: vine.number().integer().positive().required(),
});

export const updateReviewSchema = vine.object({
  rating: vine.number().integer().min(1).max(5).optional(),
  comment: vine.string().max(250).optional(),
  review_date: vine.date().optional(),
  customer_id: vine.number().integer().positive().optional(),
  renter_id: vine.number().integer().positive().optional(),
  order_id: vine.number().integer().positive().optional(),
});
