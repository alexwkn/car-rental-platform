import prisma from "../../database/databaseORM.js";
//import { createOfferSchema,updateOfferSchema } from "../middleware/validator/offer.js";    

/**
 * @swagger
 * components:
 *   schemas:
 *     Offer:
 *       type: object
 *       properties:
 *         offer_id:
 *           type: integer
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         fuel_level:
 *           type: number
 *           format: float
 *         adress:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         description:
 *           type: string
 *         vehicule_id:
 *           type: integer
 *         vehicule:
 *           $ref: '#/components/schemas/Vehicule'
 *         order:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 */
export const getOfferById = async (req, res) => {
    try {
        const offer = await prisma.offer.findUnique({
            where: {
                offer_id: parseInt(req.params.id)
            }
        });
        if (offer) {
            res.send(offer);
        }
        else {
            res.status(404).send('Offer not found');
        }       
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const getAllOffers = async (req, res) => {  
    try {
        const offers = await prisma.offer.findMany({
            orderBy: {
                offer_id: "asc"
            }
        }); 
        if (offers.length > 0) {
            res.status(200).json(offers);
        } else {
            res.status(404).send('No offers found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

export const createOffer = async (req, res) => {};
export const updateOffer = async (req, res) => {};
export const deleteOffer = async (req, res) => {};