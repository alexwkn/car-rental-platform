import prisma from "../../database/databaseORM.js";
import { ProfileValidator } from "../middleware/validator/profile.js";

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

export const createProfile = async (req, res) => {
  try {
      const { name, email, password, adress, bank_account, is_renter, profile_picture } = req.body;
      const validatedData = await ProfileValidator.validate({
          name,
          email,
          password,
          adress,
          bank_account,
          is_renter,
          profile_picture
      });

      const hashedPassword = await hash(validatedData.password);

      const newProfile = await prisma.profile.create({
          data: {
              ...validatedData,
              password: hashedPassword
          }
      });
      res.status(201).json({
          message: "Profile created successfully",
          data: newProfile,
      });
  } catch (err) {
      if (err.messages) {
          return res.status(422).json({
              message: "Validation error",
              errors: err.messages,
          });
      }
      return res.status(500).json({
          message: "Server error",
          error: err.message || err,
      });
  }


};
export const updateProfile = async (req, res) => {
  try {
    const validatedData = await ProfileValidator.validate(req.body);
    const updatedProfile = await prisma.profile.update({
      where: {
        profile_id: parseInt(req.params.id),
      },
      data: validatedData,
    });
    res.status(200).json({  
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const deletedProfile = await prisma.profile.delete({
      where: {
        profile_id: parseInt(req.params.id),
      },
    });
    res.status(200).json({
      message: "Profile deleted successfully",
      data: deletedProfile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
