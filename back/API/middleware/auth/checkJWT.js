import {verify} from "../../../utils/jwt.js";
import logger from "../../../utils/logger.js";
import {TOKEN_COOKIE_NAME} from "../../../utils/authCookie.js";

export const checkJWT = async (req, res, next) => {
    const authorize = req.get('authorization');
    //mobile
    const jwtFromHeader = authorize?.includes('Bearer') ? authorize.split(' ')[1] : null;
    //web
    const jwtFromCookie = req.cookies?.[TOKEN_COOKIE_NAME] ?? null;
    const jwtEncoded = jwtFromHeader ?? jwtFromCookie;

    if (!jwtEncoded) {
        logger.warn(`Tentative d'accès à ${req.originalUrl} sans token JWT`);
        return res.status(401).send('No jwt');
    }

    try {
        req.session = verify(jwtEncoded);
        next();
    } catch (e) {
        logger.warn(`Tentative d'identification invalide (JWT rejeté) : ${e.message}`);
        res.status(401).send(e.message);
    }
};