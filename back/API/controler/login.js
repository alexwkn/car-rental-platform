import {readPerson} from "../model/person.js";
import {sign} from "../../utils/jwt.js";

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
        console.log('[LOGIN] Attempting login with email:', req.body.email);
        const rep = await readPerson(req.body.email, req.body.password);
        console.log('[LOGIN] readPerson result:', rep);
        if(rep.id) {
            console.log('[LOGIN] Success - status:', rep.status);
            const jwt = sign(rep, {
                expiresIn: '1h'
            });
            res.status(201).send(jwt);
        } else {
            console.log('[LOGIN] Failed - no user found or password invalid');
            res.sendStatus(404);
        }
    } catch (err) {
        console.error('[LOGIN] Error:', err);
        res.sendStatus(500);
    }
};