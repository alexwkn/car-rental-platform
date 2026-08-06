import {Router} from 'express';

import{default as orderRouter} from './order.js';
import{default as profileRouter} from './profile.js';
import{default as reviewRouter} from './review.js';
import{default as vehiculeRouter} from './vehicule.js';
import{default as offerRouter} from './offer.js';
import{default as favoriteRouter} from './favorite.js';
import{default as loginRouter} from './login.js';
import{default as createAccountRouter} from './createAccount.js';
import{default as logoutRouter} from './logout.js';
import{default as meRouter} from './me.js';
import { checkJWT } from '../middleware/auth/checkJWT.js';
import logger from '../../utils/logger.js';

const router = Router();


router.use('/orders', checkJWT, orderRouter);
router.use('/profiles', checkJWT, profileRouter);
router.use('/reviews', checkJWT, reviewRouter);
router.use('/vehicules', checkJWT, vehiculeRouter);
router.use('/offers', checkJWT, offerRouter);
router.use('/favorite', checkJWT, favoriteRouter);
router.use('/login', loginRouter);
router.use('/createAccount', createAccountRouter);
router.use('/logout', logoutRouter);
router.use('/me', checkJWT, meRouter);

router.use((req, res) => {
    logger.warn(`Mauvaise URL demandée : ${req.path}`);
    return res.status(404).send("Not Found");
});

export default router;
