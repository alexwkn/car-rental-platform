import prisma from "../../database/databaseORM.js";
//import { createOfferSchema,updateOfferSchema } from "../middleware/validator/offer.js";    

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