import prisma from "../../database/databaseORM.js";
import { OfferValidator } from "../middleware/validator/offer.js";    

const formatDate = (d) => d ? new Date(d).toISOString().slice(0,10) : null;
const formatOffer = (o) => ({
    ...o,
    start_date: formatDate(o.start_date),
    end_date: formatDate(o.end_date),
});

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
 */

export const getOfferById = async (req, res) => {
    try {
        const offer = await prisma.offer.findUnique({
            where: {
                offer_id: parseInt(req.params.id)
            }
        });
        if (offer) {
            const formatted = formatOffer(offer);
            res.send(formatted);
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
            res.status(200).json(offers.map(formatOffer));
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
            start_date: new Date(validatedData.start_date),
            end_date: new Date(validatedData.end_date),
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
            data: formatOffer(newOffer),
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
            start_date: req.body.start_date ?? existingOffer.start_date,
            end_date: req.body.end_date ?? existingOffer.end_date,
            fuel_level: req.body.fuel_level ?? existingOffer.fuel_level,
            adress: req.body.adress ?? existingOffer.adress,
            price: req.body.price ?? existingOffer.price,
            description: req.body.description ?? existingOffer.description,
            vehicule_id: req.body.vehicule_id ?? existingOffer.vehicule_id,
        };
        const validatedData = await OfferValidator.validate(bodyToValidate);
        const updatedOffer = await prisma.offer.update({
            where: {
                offer_id: parseInt(req.params.id)
            },
            data: {
                ...validatedData,
                start_date: new Date(validatedData.start_date),
                end_date: new Date(validatedData.end_date),
            },
        });
        res.status(200).json({
            message: 'Offer updated successfully',
            data: formatOffer(updatedOffer),
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