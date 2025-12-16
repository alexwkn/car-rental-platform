/**
 * @swagger
 * components:
 *   responses:
 *     mustBeManager:
 *       description: The action must be realized by a manager
 *       content:
 *         application/json:
 *           example:
 *             message: "Forbidden: manager required"
 */
export const manager = (req, res, next) => {
    if(req.session.status === 'manager'){
        next();
    } else {
        res.sendStatus(403);
    }
};