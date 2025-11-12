import Router from 'express';
import { createAccount } from '../controler/createAccount.js';

const router = Router();
router.post('/', createAccount);

export default router;