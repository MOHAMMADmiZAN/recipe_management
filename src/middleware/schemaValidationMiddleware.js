/**
 * Middleware for validating request body, params, or query against a Joi schema.
 *
 * @param {import('joi').ObjectSchema} schema - The Joi schema to validate against.
 * @param {string} [type='body'] - The type of validation ('body', 'params', or 'query').
 * @returns {import('express').RequestHandler} - Express middleware function.
 */
const schemaValidationMiddleware = (schema, type = 'body') => {
    /**
     * Express middleware function.
     *
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @param {import('express').NextFunction} next - Express next function.
     */
    return async (req, res, next) => {
        let validationPayload;
        switch (type) {
            case 'params':
                validationPayload = req.params;
                break;
            case 'query':
                validationPayload = req.query;
                break;
            default:
                validationPayload = req.body;
                break;
        }
        try {
            await schema.validateAsync(validationPayload, { abortEarly: false });
            next();
        } catch (error) {
            const errorMessages = error.details.reduce((acc, detail) => ({
                ...acc,
                [detail.context.key]: detail.message.replace(/\"/g, ''),
            }), {});
            res.status(400).json({ code: 400, errors: errorMessages });
        }
    };
};

module.exports = schemaValidationMiddleware;
