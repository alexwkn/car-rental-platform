import Router from 'express';
import { logout } from '../controler/logout.js';

const router = Router();
router.post('/', logout);

export default router;
