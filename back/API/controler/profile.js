import prisma from "../../database/databaseORM.js";
import { ProfileValidator } from "../middleware/validator/profile.js";
import { saveImage, deleteImage } from "../../utils/imageManager.js";
import { hash } from "../../utils/hash.js";
import * as uuid from "uuid";

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
    const {
      name,
      email,
      password,
      adress,
      bank_account,
      is_renter,
      profile_picture,
    } = req.body;
    const validatedData = await ProfileValidator.validate({
      name,
      email,
      password,
      adress,
      bank_account,
      is_renter,
      profile_picture,
    });

    const hashedPassword = await hash(validatedData.password);

    const newProfile = await prisma.profile.create({
      data: {
        ...validatedData,
        password: hashedPassword,
      },
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
    const existingProfile = await prisma.profile.findUnique({
      where: {
        profile_id: parseInt(req.params.id),
      },
    });
    if (!existingProfile) {
      return res.status(404).send("Profile not found");
    }

    const bodyToValidate = {
      name: req.body.name ?? existingProfile.name,
      email: req.body.email ?? existingProfile.email,
      password: req.body.password ?? existingProfile.password,
      adress: req.body.adress ?? existingProfile.adress,
      bank_account: req.body.bank_account ?? existingProfile.bank_account,
      is_renter: req.body.is_renter ?? existingProfile.is_renter,
      profile_picture:
        req.body.profile_picture ?? existingProfile.profile_picture,
    };
    
    const validatedData = await ProfileValidator.validate(bodyToValidate);
    
    // hasher le mdp si il est mis à jour
    const dataToUpdate = { 
      ...validatedData,
      password: req.body.password
        ? await hash(req.body.password)
        : existingProfile.password, 
    };
    
    const updatedProfile = await prisma.profile.update({
      where: { profile_id: parseInt(req.params.id) },
      data: dataToUpdate,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (err) {
    if (err.messages) {
      return res.status(422).json({
        message: "Validation error",
        errors: err.messages,
      });
    }
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { profile_id: parseInt(req.params.id) },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.profile_picture) {
      try {
        await deleteImage(profile.profile_picture);
      } catch (err) {
        console.warn(
          "Error occurred while deleting the profile image:",
          err.message
        );
      }
    }

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

export const uploadProfileImage = async (req, res) => {
  try {
    const profileId = parseInt(req.params.id);

    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { profile_id: profileId },
      select: { profile_picture: true },
    });

    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const imageName = uuid.v4();
    const imagePath = `profiles/${imageName}.jpeg`;
    await saveImage(req.file.buffer, imageName, "upload/profiles");

    if (existingProfile.profile_picture) {
      try {
        await deleteImage(existingProfile.profile_picture);
      } catch (err) {
        console.warn(
          "Error occurred while deleting the old image:",
          err.message
        );
      }
    }

    const updatedProfile = await prisma.profile.update({
      data: { profile_picture: imagePath },
      where: { profile_id: profileId },
      select: { profile_picture: true, profile_id: true },
    });

    res.status(200).json({
      message: "Profile image updated successfully",
      data: updatedProfile,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: "An error occurred while uploading the image",
      details: e.message,
    });
  }
};

export const deleteProfileImage = async (req, res) => {
  try {
    const profileId = parseInt(req.params.id);

    const profile = await prisma.profile.findUnique({
      where: { profile_id: profileId },
      select: { profile_picture: true },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (!profile.profile_picture) {
      return res.status(400).json({
        message: "No profile picture to delete",
      });
    }

    try {
      await deleteImage(profile.profile_picture);
    } catch (err) {
      console.warn(
        "Error occurred while deleting the image from disk:",
        err.message
      );
    }

    const updatedProfile = await prisma.profile.update({
      where: { profile_id: profileId },
      data: { profile_picture: null },
      select: { profile_id: true, profile_picture: true },
    });

    res.status(200).json({
      message: "Profile image deleted successfully",
      data: updatedProfile,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: "An error occurred while deleting the image.",
      details: e.message,
    });
  }
};

export const deleteMe = async (req, res) => {
  try {
    const myId = req.session?.id; // mis par checkJWT
    if (!myId) return res.status(401).json({ message: "Unauthorized" });

    const profile = await prisma.profile.findUnique({
      where: { profile_id: myId },
    });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    if (profile.profile_picture) {
      try {
        await deleteImage(profile.profile_picture);
      } catch (err) {
        console.warn("Error deleting profile image:", err.message);
      }
    }

    await prisma.profile.delete({
      where: { profile_id: myId },
    });

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

