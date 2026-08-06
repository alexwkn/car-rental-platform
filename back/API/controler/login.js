import {readPerson} from "../model/person.js";
import {sign} from "../../utils/jwt.js";
import logger from "../../utils/logger.js";
import {TOKEN_COOKIE_NAME, tokenCookieOptions} from "../../utils/authCookie.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "client@mail.com"
 *         password:
 *           type: string
 *           example: "password123"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: string
 *       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

export const login = async (req, res) => {

    try {
        const rep = await readPerson(req.body.email, req.body.password);
        if(rep.id) {
            const jwt = sign(rep, {
                expiresIn: '1h'
            });
            res.cookie(TOKEN_COOKIE_NAME, jwt, {
                ...tokenCookieOptions,
                maxAge: 60 * 60 * 1000,
            });

            res.status(201).send(jwt);
        } else {
            logger.warn(`Tentative de connexion échouée pour l'email : ${req.body.email}`);
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        logger.error(`Erreur lors du login : ${err.message}`);
        res.sendStatus(500);
    }
};