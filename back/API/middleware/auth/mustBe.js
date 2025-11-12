export const manager = (req, res, next) => {
    if(req.session.status === 'manager'){
        next();
    } else {
        res.sendStatus(403);
    }
};