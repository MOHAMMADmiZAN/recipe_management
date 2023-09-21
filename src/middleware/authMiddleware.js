const jwt = require('jsonwebtoken');
const { getUserById } = require('../lib/user');
const {decodeToken} = require("../utils/JwtTokenUtil");

/**
 * Middleware for user authentication using JWT.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void}
 */
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                code: 401,
                message: 'Unauthorized',
            });
        }

        const tokenParts = token.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({
                message: 'Invalid token format',
            });
        }

        const tokenValue = tokenParts[1];

        // Verify and decode the token
        const decodedToken = await decodeToken(tokenValue);
        // Find the user based on the decoded token (assuming it contains user ID)
        const user = await getUserById(decodedToken.id);

        if (!user) {
            return res.status(401).json({
                code: 401,
                message: 'Unauthorized',
            });
        }

        // Attach the user object to the request for further use
        req.user = user;

        console.log(`User ${user.email} authenticated successfully`)

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authMiddleware;
