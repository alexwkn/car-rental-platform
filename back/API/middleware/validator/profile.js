import vine from "vine";

// Validation pour profile
export const createProfileSchema = vine.object({
  name: vine.string().trim().min(2).max(255).required(),
  email: vine.string().email().max(100).required(),
  password: vine.string().min(6).max(255).required(),
  adress: vine.string().optional(),
  bank_account: vine.string().max(50).optional(),
  is_renter: vine.boolean().optional(),
  profile_picture: vine.string().optional(),
});

export const updateProfileSchema = vine.object({
  name: vine.string().trim().min(2).max(255).optional(),
  email: vine.string().email().max(100).optional(),
  password: vine.string().min(6).max(255).optional(),
  adress: vine.string().optional(),
  bank_account: vine.string().max(50).optional(),
  is_renter: vine.boolean().optional(),
  profile_picture: vine.string().optional(),
});
