import Router from 'express';
import { getAllFavorites, getFavoriteById, createFavorite, deleteFavorite } from '../controler/favorite.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();

router.get('/', manager, getAllFavorites);
router.get('/:id', manager, getFavoriteById);
router.post('/', manager, createFavorite);
router.delete('/:id', manager, deleteFavorite);

export default router;