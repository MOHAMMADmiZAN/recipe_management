const jwt = require('jsonwebtoken');
const { errorHandler } = require('./error');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

/**
 * Encode data into a JSON Web Token (JWT).
 * @param {Object} data - Data to be encoded in the token.
 * @returns {Promise<string>} - The JWT.
 * @throws {Error} - If encoding fails.
 */
const encodeToken = async (data) => {
    try {
        return await jwt.sign(data, secretKey);
    } catch (error) {
        errorHandler(`Failed to encode token: ${error.message}`, 500);
    }
};

/**
 * Decode a JSON Web Token (JWT) and retrieve the data.
 * @param {string} token - The JWT to decode.
 * @returns {Promise<Object>} - Decoded data.
 * @throws {Error} - If decoding fails.
 */
const decodeToken = async (token) => {
    try {
        return await jwt.verify(token, secretKey);
    } catch (error) {
        errorHandler(`Failed to decode token: ${error.message}`, 500);
    }
};

module.exports = {
    encodeToken,
    decodeToken,
};
