import Router from 'express';
import { getAllFavorites, getFavoriteById, createFavorite, deleteFavorite,updateFavorite } from '../controler/favorite.js';
import { manager } from '../middleware/auth/mustBe.js';

const router = Router();

router.get('/', manager, getAllFavorites);
router.get('/:id', manager, getFavoriteById);
router.post('/', manager, createFavorite);
router.patch('/:id', manager, updateFavorite);
router.delete('/:id', manager, deleteFavorite);

export default router;