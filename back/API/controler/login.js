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
        const rep = await readPerson(req.body.email, req.body.password);
        if(rep.id) {
            console.log(rep.status);
            const jwt = sign(rep, {
                expiresIn: '1h'
            });
            res.status(201).send(jwt);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};