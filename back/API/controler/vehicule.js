import prisma from "../../database/databaseORM.js";
//import { createVehiculeSchema, updateVehiculeSchema } from "../middleware/validator/vehicule.js";

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
