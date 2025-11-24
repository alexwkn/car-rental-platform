import prisma from "../../database/databaseORM";
//import { createFavoriteSchema,updateFavoriteSchema } from "../middleware/validator/favorite.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       properties:
 *         favorite_id:
 *           type: integer
 *         profile_id:
 *           type: integer
 *         vehicule_id:
 *           type: integer
 *         profile:
 *           $ref: '#/components/schemas/Profile'
 *         vehicule:
 *           $ref: '#/components/schemas/Vehicule'
 */
export const getFavoriteById = async (req, res) => {
    try {
        const favorite = await prisma.favorite.findUnique({
            where: {
                favorite_id: parseInt(req.params.id)
            }
        });
        if (favorite) {
            res.send(favorite);
        }  
        else {
            res.status(404).send('Favorite not found');
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};  

export const getAllFavorites = async (req, res) => {  
    try {
        const favorites = await prisma.favorite.findMany({
            orderBy: {
                favorite_id: "asc"
            }
        });
        if (favorites.length > 0) {
            res.status(200).json(favorites);
        } else {
            res.status(404).send('No favorites found');
        }   
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

export const createFavorite = async (req, res) => {};
export const updateFavorite = async (req, res) => {};
export const deleteFavorite = async (req, res) => {};