import prisma from "../../database/databaseORM.js";
import { VehiculeValidator } from "../middleware/validator/vehicule.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicule:
 *       type: object
 *       properties:
 *         vehicule_id:
 *           type: integer
 *         model:
 *           type: string
 *         licence_plate:
 *           type: string
 *         description:
 *           type: string
 *         owner_id:
 *           type: integer
 */

export const getVehiculeById = async (req, res) => {
  try {
    const vehicule = await prisma.vehicule.findUnique({
      where: {
        vehicule_id: parseInt(req.params.id),
      },
    });
    if (vehicule) {
      res.send(vehicule);
    } else {
      res.status(404).send("Vehicule not found");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
export const getAllVehicules = async (req, res) => {
  try {
    const vehicules = await prisma.vehicule.findMany({
      orderBy: {
        vehicule_id: "asc",
      },
    });
    if (vehicules.length > 0) {
      res.status(200).json(vehicules);
    } else {
      res.status(404).send("No vehicules found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const createVehicule = async (req, res) => {
  try {
    const validatedData = await VehiculeValidator.validate(req.body);
    const newVehicule = await prisma.vehicule.create({
      data: validatedData,
    });
    res.status(201).json({
      message: "Vehicule created successfully",
      data: newVehicule,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const createVehiculeWithOffer = async (req, res) => {
  try {
    const userId = req.session.id;
    const { vehicule, offer } = req.body;

    const validatedVehicule = await VehiculeValidator.validate({
      ...vehicule,
      owner_id: userId,
    });

    const result = await prisma.$transaction(async (prisma) => {
      const newVehicule = await prisma.vehicule.create({
        data: validatedVehicule,
      });

      const newOffer = await prisma.offer.create({
        data: {
          start_date: new Date(offer.start_date),
          end_date: new Date(offer.end_date),
          fuel_level: parseFloat(offer.fuel_level),
          adress: offer.adress,
          price: parseFloat(offer.price),
          description: offer.description || null,
          vehicule_id: newVehicule.vehicule_id,
        },
      });

      return { vehicule: newVehicule, offer: newOffer };
    });

    res.status(201).json({
      message: "Vehicule and offer created successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    if (err.messages) {
      return res.status(422).json({
        message: "Validation error",
        errors: err.messages,
      });
    }
    res.status(500).json({
      message: "Server error",
      error: err.message || err,
    });
  }
};

export const updateVehicule = async (req, res) => {
  try {
    const existingVehicule = await prisma.vehicule.findUnique({
      where: {
        vehicule_id: parseInt(req.params.id),
      },
    });
    if (!existingVehicule) {
      return res.status(404).send("Vehicule not found");
    }

    const bodyToValidate = {
      model: req.body.model ?? existingVehicule.model,
      licence_plate: req.body.licence_plate ?? existingVehicule.licence_plate,
      description: req.body.description ?? existingVehicule.description,
      owner_id: req.body.owner_id ?? existingVehicule.owner_id,
    };
    const validatedData = await VehiculeValidator.validate(bodyToValidate);

    const updatedVehicule = await prisma.vehicule.update({
      where: { vehicule_id: parseInt(req.params.id) },
      data: validatedData,
    });
    res.status(200).json({
      message: "Vehicule updated successfully",
      data: updatedVehicule,
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
export const deleteVehicule = async (req, res) => {
  try {
    const existingVehicule = await prisma.vehicule.findUnique({
      where: {
        vehicule_id: parseInt(req.params.id),
      },
    });
    if (!existingVehicule) {
      return res.status(404).send("Vehicule not found");
    }
    await prisma.vehicule.delete({
      where: {
        vehicule_id: parseInt(req.params.id),
      },
    });
    res.status(200).json({ message: "Vehicule deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const deleteOwnVehicule = async (req, res) => {
  try {
    const userId = req.session.id;
    const vehiculeId = parseInt(req.params.id);

    const existingVehicule = await prisma.vehicule.findUnique({
      where: {
        vehicule_id: vehiculeId,
      },
    });

    if (!existingVehicule) {
      return res.status(404).json({ message: "Vehicule not found" });
    }

    if (existingVehicule.owner_id !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own vehicles" });
    }

    await prisma.vehicule.delete({
      where: {
        vehicule_id: vehiculeId,
      },
    });

    res.status(200).json({ message: "Vehicule deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getUserVehicules = async (req, res) => {
  try {
    const userId = req.session.id;

    const vehicules = await prisma.vehicule.findMany({
      where: {
        owner_id: userId,
      },
      include: {
        offer: true,
      },
      orderBy: {
        vehicule_id: "asc",
      },
    });

    res.status(200).json(vehicules);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
