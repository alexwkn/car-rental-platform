import prisma from "../../database/databaseORM.js";
//import { createVehiculeSchema, updateVehiculeSchema } from "../middleware/validator/vehicule.js";

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

export const createVehicule = async (req, res) => {};
export const updateVehicule = async (req, res) => {};
export const deleteVehicule = async (req, res) => {};
