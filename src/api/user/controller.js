const {
    getUserById,
    generateUserLinks,
    updateUserById,
    getUserByKey,
    updatePassword, deleteUserById
} = require('../../lib/user');
const {handleErrors} = require("../../utils/error");
const {comparePassword} = require("../../utils/PasswordUtility");

/**
 * Get user data by ID.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - A promise that resolves to user data or an error response.
 */
const getUserData = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) {
            return handleErrors(res, new Error("User not found"), 404);
        }
        return res.status(200).json({
            code: 200,
            message: "User data retrieved successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles,
            },
            links: generateUserLinks(id, '/users')
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user data by ID.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - A promise that resolves to updated user data or an error response.
 */
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (req.user._id.toString() !== id) {
            return handleErrors(res, new Error("Access denied. You do not have permission to perform this operation."), 401);
        }
        const user = await getUserById(id);
        if (!user) {
            return handleErrors(res, new Error("User not found"), 404);
        }

        const { email, name, roles } = req.body;
        if (!email && !name && (!roles || roles.length === 0)) {
            return handleErrors(res, new Error("Invalid request payload"), 400);
        }

        const payload = {
            email: email || user.email,
            name: name || user.name,
            roles: roles || user.roles,
        };
        const updatedUser = await updateUserById(id, payload);

        return res.status(200).json({
            code: 200,
            message: "User Updated Successfully",
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                roles: updatedUser.roles,
            },
            links: generateUserLinks(id, '/users')
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user password by ID.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - A promise that resolves to updated user data or an error response.
 */
const updateUserPassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (req.user._id.toString() !== id) {
            return handleErrors(res, new Error("Access denied. You do not have permission to perform this operation."), 401);
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return handleErrors(res, new Error("Invalid request payload"), 400);
        }
        const user = await getUserByKey(id, true);
        if (!user) {
            return handleErrors(res, new Error("User not found"), 404);
        }
        const isMatch = await comparePassword(currentPassword, user.password);
        if (!isMatch) {
            return handleErrors(res, new Error("Invalid current password"), 400);
        }
        const updatedUser = await updatePassword(id, newPassword);
        return res.status(200).json({
            code: 200,
            message: "User password updated successfully",
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                roles: updatedUser.roles,
            },
            links: generateUserLinks(id, '/users')
        });
    } catch (e) {
        next(e);
    }
};

/**
 * Delete a user by ID.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - A promise that resolves to a success message or an error response.
 */
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (req.user._id.toString() !== id) {
            return handleErrors(res, new Error("Access denied. You do not have permission to perform this operation."), 401);
        }
        const user = await getUserById(id);
        if (!user) {
            return handleErrors(res, new Error("User not found"), 404);
        }
        await deleteUserById(id);
        return res.status(200).json({
            code: 200,
            message: "User deleted successfully",
        });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getUserData,
    updateUser,
    updateUserPassword,
    deleteUser,
};

