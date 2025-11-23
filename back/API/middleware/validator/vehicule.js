import vine from "vine";

// Validation pour vehicule
export const createVehiculeSchema = vine.object({
  model: vine.string().trim().min(1).max(100).required(),
  licence_plate: vine.string().trim().min(1).max(20).required(),
  description: vine.string().optional(),
  owner_id: vine.number().integer().positive().required(),
});

export const updateVehiculeSchema = vine.object({
  model: vine.string().trim().min(1).max(100).optional(),
  licence_plate: vine.string().trim().min(1).max(20).optional(),
  description: vine.string().optional(),
  owner_id: vine.number().integer().positive().optional(),
});
