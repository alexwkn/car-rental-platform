import prisma from "../../database/databaseORM.js";
import { ReviewValidator } from "../middleware/validator/review.js";

const formatDate = (d) => d ? new Date(d).toISOString().slice(0,10) : null;
const isoDate = (d) => d ? new Date(d) : null;
const formatReview = (r) => ({
    ...r,
    review_date: formatDate(r.review_date),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         review_id:
 *           type: integer
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *         review_date:
 *           type: string
 *           format: date
 *         customer_id:
 *           type: integer
 *         renter_id:
 *           type: integer
 *         order_id:
 *           type: integer
 */

export const getReviewById = async (req, res) => {
    try {
        const review = await prisma.review.findUnique({
            where: {
                review_id: parseInt(req.params.id)
            }
        });
        if (review) {
            res.send(formatReview(review));
        }
        else {
            res.status(404).send('Review not found');
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: {  
                review_id: "asc"
            }
        });
        if (reviews.length > 0) {
            res.status(200).json(reviews.map(formatReview));
        } else {
            res.status(404).send('No reviews found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

export const getReviewsByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const reviews = await prisma.review.findMany({
            where: {
                customer_id: userId
            },
            orderBy: {  
                review_date: "desc"
            }
        });
        res.status(200).json(reviews.map(formatReview));
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

export const createReview = async (req, res) => {
    try {
        const validatedData = await ReviewValidator.validate(req.body);
        
        const review_date = validatedData.review_date || new Date();

        const payload = {
            ...validatedData,
            review_date: isoDate(review_date) ?? new Date(),
        };

        const newReview =  await prisma.review.create({
            data: payload
        });
        res.status(201).json({
            message: 'Review created successfully',
            data: formatReview(newReview),
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
const isoOrUndefined = d => (d instanceof Date ? d.toISOString() : undefined);

export const updateReview = async (req, res) => {
    try {
        const existingReview = await prisma.review.findUnique({
            where: {
                review_id: parseInt(req.params.id)
            }
        });
        if (!existingReview) {
            return res.status(404).send('Review not found');
        }
        const bodyToValidate = {
            rating: req.body.rating ?? existingReview.rating,
            comment: req.body.comment ?? existingReview.comment,
            review_date: req.body.review_date ?? formatDate(existingReview.review_date),
            customer_id: req.body.customer_id ?? existingReview.customer_id,
            renter_id: req.body.renter_id ?? existingReview.renter_id,
            order_id: req.body.order_id ?? existingReview.order_id,
        };
        const validatedData = await ReviewValidator.validate(bodyToValidate);
        const updatedReview = await prisma.review.update({
            where: {
                review_id: parseInt(req.params.id)
            },
            data: {
                ...validatedData,
                review_date: validatedData.review_date ? isoDate(validatedData.review_date) : existingReview.review_date,
            }
        });
        res.status(200).json({
            message: 'Review updated successfully',
            data: formatReview(updatedReview),
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

export const deleteReview = async (req, res) => {
    try {
        const existingReview = await prisma.review.findUnique({
            where: {
                review_id: parseInt(req.params.id)
            }
        });
        if (!existingReview) {
            return res.status(404).send('Review not found');
        }
        await prisma.review.delete({
            where: {
                review_id: parseInt(req.params.id)
            }
        });
        res.status(200).json({
            message: 'Review deleted successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};