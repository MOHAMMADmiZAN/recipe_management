const {
    createUser,
    getUserByEmail,
    getUserWithPassword,
    generateUserAccessToken, getUserByKey,
} = require("../../lib/user");
const { comparePassword } = require("../../utils/PasswordUtility");
const {handleErrors} = require("../../utils/error");



/**
 * Controller for user registration.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
const register = async (req, res) => {
    try {
        const { email, password, roles , name } = req.body;

        const userExists = await getUserByEmail(email);
        if (userExists) {
            return handleErrors(res, new Error("User with this email already exists."), 409);
        }

        await createUser({ email, password, roles,name });

        return res.status(201).json({
            code: 201,
            message: "User created successfully",
            links: {
                sign_in: {
                    rel: "sign_in",
                    href: "/auth/signin",
                    method: "POST",
                },
            },
        });
    } catch (error) {
        return handleErrors(res, error);
    }
};

/**
 * Controller for user login.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByKey({ email }, true);

        if (!user || !(await comparePassword(password, user.password))) {
            return handleErrors(res, new Error("Invalid Credential"), 400);
        }
        const token = await generateUserAccessToken(user);
        return res.status(200).json({
            code: 200,
            message: "User login successfully",
            data: {
                id: user.id,
                email: user.email,
                roles: user.roles,
                token: token,
            },
            links: {
                logout: {
                    rel: "logout",
                    href: "/auth/logout",
                    method: "POST",
                },
                profile: {
                    rel: "profile",
                    href: `/users/${user._id}`,
                    method: "GET",
                },
            },
        });
    } catch (error) {
        return handleErrors(res, error);
    }
};

module.exports = {
    register,
    login,
};
