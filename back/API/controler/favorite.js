import prisma from "../../database/databaseORM.js";
import { FavoriteValidator } from "../middleware/validator/favorite.js";
import logger from "../../utils/logger.js";

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
        logger.error(err.message, { stack: err.stack });
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
        res.status(200).json(favorites);
    } catch (err) {
        logger.error(err.message, { stack: err.stack });
        res.status(500).send('Server error');
    }
};

export const createFavorite = async (req, res) => {
    try {
        const newFavorite = await prisma.favorite.create({
            data: req.validated
        });
        res.status(201).json({
            message: 'Favorite created successfully',
            data: newFavorite,
        });
    } catch (err) {
    if (err.code === 'P2002') {
        return res.status(409).json({
            message: 'This vehicule is already in your favorites',
        });
    }
    logger.error(err.message, { stack: err.stack });
    return res.status(500).json({
      message: 'Server error',
      error: err.message || err,
    });
    }
};

export const updateFavorite = async (req, res) => {
    try {
        const existingFavorite =  await  prisma.favorite.findUnique({
            where: {
                favorite_id: parseInt(req.params.id)
            }
        });
        if (!existingFavorite) {
            return res.status(404).json({
                message: 'Favorite not found',
            });
        }
        const bodyToValidate = {
            profile_id: req.body.profile_id ?? existingFavorite.profile_id,
            vehicule_id: req.body.vehicule_id ?? existingFavorite.vehicule_id,
        };
        const validatedData = await FavoriteValidator.validate(bodyToValidate);

        const updatedFavorite = await prisma.favorite.update({
            where: {
                favorite_id: parseInt(req.params.id)
            },
            data: validatedData,
        });
        res.status(200).json({
            message: 'Favorite updated successfully',
            data: updatedFavorite,
        });
    } catch (err) {
        if (err.messages) {
            return res.status(422).json({
                message: 'Validation error',
                errors: err.messages,
            });
        }
        return res.status(500).json({
            message: 'Server error',
            error: err.message || err,
        });
    }
};

export const deleteFavorite = async (req, res) => {
    try {
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                favorite_id: parseInt(req.params.id)
            }
        });
        if (!existingFavorite) {
            return res.status(404).json({
                message: 'Favorite not found',
            });
        }
        await prisma.favorite.delete({
            where: {
                favorite_id: parseInt(req.params.id)
            }
        });
        res.status(200).json({
            message: 'Favorite deleted successfully',
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Server error',
            error: err.message || err,
        });
    }
};