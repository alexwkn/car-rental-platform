import prisma from "../../database/databaseORM.js";
//import { createReviewSchema, updateReviewSchema } from "../middleware/validator/review.js";

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

export const createReview = async (req, res) => {};
export const updateReview = async (req, res) => {};
export const deleteReview = async (req, res) => {};