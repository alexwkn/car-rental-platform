import prisma from "../../database/databaseORM.js";
//import { createProfileSchema, updateProfileSchema } from "../middleware/validator/profile.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         profile_id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         adress:
 *           type: string
 *         bank_account:
 *           type: string
 *         is_renter:
 *           type: boolean
 *         profile_picture:
 *           type: string
 */

export const getProfileById = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: {
        profile_id: parseInt(req.params.id),
      },
    });
    if (profile) {
      res.send(profile);
    } else {
      res.status(404).send("Profile not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: {
        profile_id: "asc",
      },
    });

    if (profiles.length > 0) {
      res.status(200).json(profiles);
    } else {
      res.status(404).send("No profiles found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const createProfile = async (req, res) => {};
export const updateProfile = async (req, res) => {};
export const deleteProfile = async (req, res) => {};
