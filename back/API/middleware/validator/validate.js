// Middleware générique de validation
export const validate = (validator) => async (req, res, next) => {
    try {
        req.validated = await validator.validate(req.body);
        next();
    } catch (err) {
        res.status(422).json({
            message: 'Validation error',
            errors: err.messages,
        });
    }
};
