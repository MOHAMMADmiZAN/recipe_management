const Joi = require('joi');

// Define a Joi schema for recipe validation with custom validation and required fields
const recipeSchema = Joi.object({
    title: Joi.string()
        .required()
        .messages({
            'any.required': 'Title is required.',
            'string.empty': 'Title cannot be empty.',
        }),
    ingredients: Joi.array()
        .items(
            Joi.object({
                ingredient: Joi.string()
                    .hex() // Validate as a hexadecimal string
                    .length(24) // MongoDB ObjectId is typically 24 characters long
                    .required()
                    .messages({
                        "string.base": "ID must be a valid MongoDB ObjectId",
                        "string.empty": "ID cannot be empty",
                        "string.length": "ID must be 24 characters long",
                        "any.required": "ID is required",
                    }),
                quantity: Joi.string()
                    .required()
                    .messages({
                        'any.required': 'Quantity is required.',
                        'string.empty': 'Quantity cannot be empty.',
                    }),
            })
        )
        .required()
        .messages({
            'any.required': 'Ingredients are required.',
            'array.base': 'Ingredients must be an array.',
        }),
    instructions: Joi.string()
        .required()
        .messages({
            'any.required': 'Instructions are required.',
            'string.empty': 'Instructions cannot be empty.',
        })
});

const updateRecipeSchema = Joi.object({
    title: Joi.string()
        .optional()
        .messages({
            'string.empty': 'Title cannot be empty.',
        })
    ,
    ingredients: Joi.array()
        .optional()
        .items(
            Joi.object({
                ingredient: Joi.string()
                    .hex()
                    .length(24)
                    .messages({
                        "string.base": "ID must be a valid MongoDB ObjectId",
                        "string.empty": "ID cannot be empty",
                        "string.length": "ID must be 24 characters long",
                    }),
                quantity: Joi.string(),
            })
        ),
    instructions: Joi.string().optional(),
});

module.exports = {
    recipeSchema,
    updateRecipeSchema
};
