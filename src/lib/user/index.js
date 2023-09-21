const User = require("../../model/User");
const { hashPassword } = require("../../utils/PasswordUtility");
const { encodeToken } = require("../../utils/JwtTokenUtil");
const { createLinkGenerator } = require("../../utils/linkGenerator");

/**
 * Create a new user.
 *
 * @param {Object} user - User object with properties like email, password, and roles.
 * @returns {Promise<Object>} - A promise that resolves to the newly created user.
 */
const createUser = async (user) => {
    user.password = await hashPassword(user.password);
    const newUser = new User(user);
    const savedUser = await newUser.save();
    return savedUser._doc; // Return only the document without Mongoose metadata
};

/**
 * Get a user by their email.
 *
 * @param {string} email - Email address of the user to retrieve.
 * @returns {Promise<Object|null>} - A promise that resolves to the user document or null if not found.
 */
const getUserByEmail = async (email) => {
    const user = await User.findOne({ email: email }).select("-password -__v");
    return user ? user._doc : null; // Return the document or null
};

/**
 * Get a user by their ID.
 *
 * @param {string} id - ID of the user to retrieve.
 * @returns {Promise<Object|null>} - A promise that resolves to the user document or null if not found.
 */
const getUserById = async (id) => {
    const user = await User.findById(id).select("-password -__v");
    return user ? user._doc : null; // Return the document or null
};

/**
 * Get user data with password.
 *
 * @param {string} email - Email address of the user to retrieve.
 * @returns {Promise<Object|null>} - A promise that resolves to the user document with password or null if not found.
 */
const getUserWithPassword = async (email) => {
    const user = await User.findOne({ email: email }).select(["password", "email", "roles", "_id"]);
    return user ? user._doc : null; // Return the document or null
};

/**
 * Find a user by a key-value pair.
 *
 * @param {string|Object} value - The value to search for. If an object is provided, the key will be determined from the object.
 * @param {boolean} [isPass=false] - Whether to include the password in the result.
 * @returns {Promise<Object|null>} - A promise that resolves to the user object or null if not found.
 */
const getUserByKey = async (value, isPass = false) => {
    // If value is not an object, assume it's the ID
    const key = typeof value === 'object' ? Object.keys(value)[0] : '_id';
    value = typeof value === 'object' ? Object.values(value)[0] : value;
    // Create a filter object based on the provided key and value
    const filter = { [key]: value };

    // Create a projection to select fields to return
    const projection = isPass ? 'password email roles _id' : 'email roles _id';

    const user = await User.findOne(filter).select(projection);
    return user ? user._doc : null; // Return the document or null
};

/**
 * Generate a JWT access token for a user.
 *
 * @param {Object} user - User object with properties like _id, email, and roles.
 * @returns {Promise<string>} - JWT access token.
 */
const generateUserAccessToken = async (user) => {
    return await encodeToken({ id: user._id, email: user.email, roles: user.roles });
};

const generateUserLinks = createLinkGenerator();

/**
 * Update a user by their ID.
 *
 * @param {string} id - ID of the user to update.
 * @param {Object} payload - The updated user data.
 * @returns {Promise<Object|null>} - The updated user or null if not found.
 */
const updateUserById = async (id, payload) => {
    return await User.findByIdAndUpdate(id, payload, { new: true }).select("-password -__v");
};

/**
 * Update a user's password by their ID.
 *
 * @param {string} id - ID of the user to update.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<Object|null>} - The updated user or null if not found.
 */
const updatePassword = async (id, newPassword) => {
    return await User.findByIdAndUpdate(id, { password: await hashPassword(newPassword) }, { new: true }).select("-password -__v");
};

/**
 * Delete a user by their ID.
 *
 * @param {string} id - ID of the user to delete.
 * @returns {Promise<Object|null>} - The deleted user or null if not found.
 */
const deleteUserById = async (id) => {
    return await User.findByIdAndDelete(id);
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getUserWithPassword,
    generateUserAccessToken,
    generateUserLinks,
    updateUserById,
    getUserByKey,
    updatePassword,
    deleteUserById,
};
