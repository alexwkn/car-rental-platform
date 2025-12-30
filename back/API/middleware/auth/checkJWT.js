import {verify} from "../../../utils/jwt.js";

export const checkJWT = async (req, res, next) => {
    const authorize = req.get('authorization');
    console.log('[JWT CHECK] Authorization header:', authorize);
    if(authorize?.includes('Bearer')){
        const jwtEncoded = authorize.split(' ')[1];
        try {
            req.session = verify(jwtEncoded);
            console.log('[JWT CHECK] Token verified:', req.session);
            next();
        } catch (e){
            console.log('[JWT CHECK] Token verification failed:', e.message);
            res.status(401).send(e.message);
        }
    } else {
        console.log('[JWT CHECK] No Bearer token found');
        res.status(401).send('No jwt');
    }
};