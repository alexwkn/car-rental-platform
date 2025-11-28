import prisma from "../../database/databaseORM.js";
import { OfferValidator } from "../middleware/validator/offer.js";    

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

export const createOffer = async (req, res) => {
    try {
        const validatedData = await OfferValidator.validate(req.body);
        const payload = {
            start_date: validatedData.start_date.toISOString(),
            end_date: validatedData.end_date.toISOString(),
            fuel_level: validatedData.fuel_level,
            adress: validatedData.adress,
            price: validatedData.price,
            description: validatedData.description,
            vehicule_id: validatedData.vehicule_id,
        };
        const newOffer = await prisma.offer.create({
            data: payload,
        });
        res.status(201).json({
            message: 'Offer created successfully',
            data: newOffer,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

export const updateOffer = async (req, res) => {
    try {
        const existingOffer =  await prisma.offer.findUnique({
            where: {
                offer_id: parseInt(req.params.id)
            }
        });
        if (!existingOffer) {
            return res.status(404).send('Offer not found');
        }
        const bodyToValidate = {
            start_date: req.body.start_date || existingOffer.start_date.toISOString(),
            end_date: req.body.end_date || existingOffer.end_date.toISOString(),
            fuel_level: req.body.fuel_level || existingOffer.fuel_level,
            adress: req.body.adress || existingOffer.adress,
            price: req.body.price || existingOffer.price,
            description: req.body.description || existingOffer.description,
            vehicule_id: req.body.vehicule_id || existingOffer.vehicule_id,
        };
        const validatedData = await OfferValidator.validate(bodyToValidate);
        const updatedOffer = await prisma.offer.update({
            where: {
                offer_id: parseInt(req.params.id)
            },
            data: validatedData,
        });
        res.status(200).json({
            message: 'Offer updated successfully',
            data: updatedOffer,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

export const deleteOffer = async (req, res) => {
    try {
        const existingOffer = await prisma.offer.findUnique({
            where: {
                offer_id: parseInt(req.params.id)
            }
        });
        if (!existingOffer) {
            return res.status(404).send('Offer not found');
        }
        await prisma.offer.delete({
            where: {
                offer_id: parseInt(req.params.id)
            }
        });
        res.status(200).json({
            message: 'Offer deleted successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};