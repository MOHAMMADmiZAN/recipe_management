const Joi = require("joi");

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.min": "Current password must be at least {#limit} characters long.",
            "any.required": "Current password is required.",
        }),
    newPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.min": "New password must be at least {#limit} characters long.",
            "any.required": "New password is required.",
        }),
});

module.exports = changePasswordSchema;
