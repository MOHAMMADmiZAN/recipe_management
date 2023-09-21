const bcrypt = require("bcryptjs");

const saltRounds = 10;
/**
 * Hashes a password using bcrypt.
 *
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 * @throws {Error} - Throws an error if hashing fails.
 */
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
}

/**
 * Compares a plain text password to a hashed password.
 *
 * @param {string} password - The plain text password to compare.
 * @param {string} hash - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
 * @throws {Error} - Throws an error if comparison fails.
 */
async function comparePassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  hashPassword,
  comparePassword,
};
