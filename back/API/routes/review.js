import Router from 'express';
import { getAllReviews, getReviewById, createReview, updateReview, deleteReview } from '../controler/review.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();

router.get('/', manager, getAllReviews);
router.get('/:id', manager, getReviewById);
router.post('/', manager, createReview); 
router.patch('/:id', manager, updateReview);
router.delete('/:id', manager, deleteReview);

export default router;