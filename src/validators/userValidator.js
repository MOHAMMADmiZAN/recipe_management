const Joi = require("joi");

// Define Joi schema for user validation with custom error messages
const userSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            "any.required": "Name is required.",
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } }) // Custom email format validation
        .required()
        .messages({
            "string.email": "Email must be a valid email address.",
            "any.required": "Email is required.",
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.min": "Password must be at least {#limit} characters long.",
            "any.required": "Password is required.",
        }),

    roles: Joi.array()
        .items(Joi.string().valid('user', 'admin')
            .messages({
                'any.only': 'Roles must be either "user" or "admin"',
                'string.base': 'Role must be a string',
            })
        )
        .optional()
        .min(1)
        .messages({
            'array.base': 'Roles must be an array of strings',
            'array.includesSingle': 'Roles must contain only valid role values',
            'array.min': 'Roles must not be empty',
        })
});
// Define Joi schema for updating user with custom error messages
const updateUserSchema = Joi.object({
    name: Joi.string()
        .optional() // Make name field optional for updates
        .messages({
            "any.required": "Name is required.",
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } }) // Custom email format validation
        .optional() // Make email field optional for updates
        .messages({
            "string.email": "Email must be a valid email address.",
            "any.required": "Email is required.",
        }),

    password: Joi.string()
        .min(6)
        .optional() // Make password field optional for updates
        .messages({
            "string.min": "Password must be at least {#limit} characters long.",
            "any.required": "Password is required.",
        }),

    roles: Joi.array()
        .items(Joi.string().valid('user', 'admin')
            .messages({
                'any.only': 'Roles must be either "user" or "admin"',
                'string.base': 'Role must be a string',
            })
        )
        .default(["user"])
        .optional()
        .min(1)
        .messages({
            'array.base': 'Roles must be an array of strings',
            'array.includesSingle': 'Roles must contain only valid role values',
            'array.min': 'Roles must not be empty',
        })
});

module.exports = {
    userSchema,
    updateUserSchema,
}
