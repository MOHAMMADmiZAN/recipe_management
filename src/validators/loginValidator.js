const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } }) // Custom email format validation
        .required()
        .trim()
        .lowercase()
        .messages({
            'string.email': 'Invalid email format. Please enter a valid email address.',
            'any.required': 'Email is required.',
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least {#limit} characters long.',
            'any.required': 'Password is required.',
        }),
});

module.exports = loginSchema;
