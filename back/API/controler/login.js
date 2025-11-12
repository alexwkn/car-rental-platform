import {readPerson} from "../model/person.js";
import {sign} from "../../utils/jwt.js";

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