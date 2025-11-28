import prisma from "../../database/databaseORM.js";
import { ReviewValidator } from "../middleware/validator/review.js";

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
 *         profile_review_customer:
 *           $ref: '#/components/schemas/Profile'
 *         profile_review_renter:
 *           $ref: '#/components/schemas/Profile'
 *         order:
 *           $ref: '#/components/schemas/Order'
 */
export const getReviewById = async (req, res) => {
    try {
        const review = await prisma.review.findUnique({
            where: {
                review_id: parseInt(req.params.id)
            }
        });
        if (review) {
            res.send(review);
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
            res.status(200).json(reviews);
        } else {
            res.status(404).send('No reviews found');
        }
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
            review_date: review_date.toISOString(),
        };

        const newReview =  await prisma.review.create({
            data: payload
        });
        res.status(201).json({
            message: 'Review created successfully',
            data: newReview,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
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
            rating: req.body.rating || existingReview.rating,
            comment: req.body.comment || existingReview.comment,
            review_date: req.body.review_date || existingReview.review_date.toISOString(),
            customer_id: req.body.customer_id || existingReview.customer_id,
            renter_id: req.body.renter_id || existingReview.renter_id,
            order_id: req.body.order_id || existingReview.order_id,
        };
        const validatedData = await ReviewValidator.validate(bodyToValidate);
        const updatedReview = await prisma.review.update({
            where: {
                review_id: parseInt(req.params.id)
            },
            data: validatedData
        });
        res.status(200).json({
            message: 'Review updated successfully',
            data: updatedReview,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
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