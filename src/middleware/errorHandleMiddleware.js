/**
 * Middleware for handling errors and sending error responses.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void}
 */
const errorMiddleware = (err, req, res, next) => {
    const message = err.message ? err.message : 'Server Error Occurred';
    const status = err.status ? err.status : 500;

    const errorResponse = {
        success: false,
        code: status,
        message: message,
    };
    res.status(status).json(errorResponse);
    next();
};

module.exports = errorMiddleware;
