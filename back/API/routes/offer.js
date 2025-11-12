import Router from 'express';
import { getAllOffers, getOfferById, createOffer, updateOffer, deleteOffer } from '../controler/offer.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();

router.get('/', manager, getAllOffers);
router.get('/:id', manager, getOfferById);
router.post('/', manager, createOffer);
router.patch('/:id', manager, updateOffer);
router.delete('/:id', manager, deleteOffer);

export default router;