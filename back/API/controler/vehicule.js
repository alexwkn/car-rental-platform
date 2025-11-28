import prisma from "../../database/databaseORM.js";
import { VehiculeValidator} from "../middleware/validator/vehicule.js";

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
 *         favorite:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Favorite'
 *         offer:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Offer'
 *         profile:
 *           $ref: '#/components/schemas/Profile'
 */
export const getVehiculeById = async (req, res) => {
    try {
        const vehicule = await prisma.vehicule.findUnique({
            where: {
                vehicule_id: parseInt(req.params.id)
            }
        });
        if (vehicule) {
            res.send(vehicule);
        }
        else {
            res.status(404).send('Vehicule not found');
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
                vehicule_id: "asc"
            }
        });
        if (vehicules.length > 0) {
            res.status(200).json(vehicules);
        } else {
            res.status(404).send('No vehicules found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }   
};

export const createVehicule = async (req, res) => {
    try {
        const validatedData = await VehiculeValidator.validate(req.body);
        const newVehicule =  await prisma.vehicule.create({
            data: validatedData
        });
        res.status(201).json({
            message: 'Vehicule created successfully',
            data: newVehicule,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

export const updateVehicule = async (req, res) => {
    try {
        const existingVehicule = await prisma.vehicule.findUnique({
            where: {
                vehicule_id: parseInt(req.params.id)
            }
        });
        if (!existingVehicule) {
            return res.status(404).send('Vehicule not found');
        }

        const bodyToValidate = {
            model: req.body.model || existingVehicule.model,
            licence_plate: req.body.licence_plate || existingVehicule.licence_plate,
            description: req.body.description ?? existingVehicule.description,
            owner_id: req.body.owner_id || existingVehicule.owner_id,
        };
        const validatedData = await VehiculeValidator.validate(bodyToValidate);

        const updatedVehicule = await prisma.vehicule.update({ 
            where: { vehicule_id: parseInt(req.params.id) },
            data: validatedData,
        });
        res.status(200).json({
            message: 'Vehicule updated successfully',
            data: updatedVehicule,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
export const deleteVehicule = async (req, res) => {
    try {
        const existingVehicule = await prisma.vehicule.findUnique({
            where: {
                vehicule_id: parseInt(req.params.id)
            }
        });
        if (!existingVehicule) {
            return res.status(404).send('Vehicule not found');
        }
        await prisma.vehicule.delete({
            where: {
                vehicule_id: parseInt(req.params.id)
            }
        });
        res.status(200).json({ message: 'Vehicule deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
