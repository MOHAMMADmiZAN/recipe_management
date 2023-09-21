const Joi = require("joi");

// Define a Joi schema for path parameter validation (_id as MongoDB ObjectId)
const pathIdSchema = Joi.object({
    id: Joi.string()
        .hex() // Validate as a hexadecimal string
        .length(24) // MongoDB ObjectId is typically 24 characters long
        .required()
        .messages({
            "string.base": "ID must be a valid MongoDB ObjectId",
            "string.empty": "ID cannot be empty",
            "string.length": "ID must be 24 characters long",
            "any.required": "ID is required",
        }),
});

module.exports = pathIdSchema;