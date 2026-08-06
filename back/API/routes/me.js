import Router from 'express';
import { me } from '../controler/me.js';

const router = Router();
router.get('/', me);

export default router;
