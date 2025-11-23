import vine from "vine";

// Validation pour favorite
export const createFavoriteSchema = vine.object({
  profile_id: vine.number().integer().positive().required(),
  vehicule_id: vine.number().integer().positive().required(),
});

export const updateFavoriteSchema = vine.object({
  profile_id: vine.number().integer().positive().optional(),
  vehicule_id: vine.number().integer().positive().optional(),
});
