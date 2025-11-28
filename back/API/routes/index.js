import Router from 'express';

import{default as orderRouter} from './order.js';
import{default as profileRouter} from './profile.js';
import{default as reviewRouter} from './review.js';
import{default as vehiculeRouter} from './vehicule.js';
import{default as offerRouter} from './offer.js';
import{default as favoriteRouter} from './favorite.js';
import { login } from '../controler/login.js';
import {createAccount} from '../controler/createAccount.js';
import { checkJWT } from '../middleware/auth/checkJWT.js';

const router = Router();


router.use('/orders', checkJWT, orderRouter);
router.use('/profiles', checkJWT, profileRouter);
router.use('/reviews', checkJWT, reviewRouter);
router.use('/vehicules', checkJWT, vehiculeRouter);
router.use('/offers', checkJWT, offerRouter);
router.use('/favorite', checkJWT, favoriteRouter);
router.post('/login', login);
router.post('/createAccount', createAccount);

router.use((req, res) => {
    console.error(`Bad URL: ${req.path}`);
    return res.status(404).send("Not Found");
});

export default router;
