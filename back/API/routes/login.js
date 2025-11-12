import Router from 'express';
import {login} from '../controler/login.js';
const router = Router();

router.post('/', login);



export default router;