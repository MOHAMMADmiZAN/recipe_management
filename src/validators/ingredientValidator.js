const Joi = require("joi");

// Define Joi schema for index validation with custom error messages
const ingredientSchema = Joi.object({
    name: Joi.string()
        .required()
        .trim()
        .messages({
            "string.empty": "Name cannot be empty",
            "any.required": "Name is required",
        }),
    description: Joi.string()
        .required()
        .messages({
            "string.empty": "Description cannot be empty",
            "any.required": "Description is required",
        }),
    category: Joi.string()
        .valid("Vegetable", "Fruit", "Protein", "Grain", "Dairy", "Other")
        .required()
        .messages({
            "any.only": "Category must be one of: Vegetable, Fruit, Protein, Grain, Dairy, Other",
            "any.required": "Category is required",
        }),
});

const updateIngredientSchema = Joi.object({
    name: Joi.string()
        .required()
        .trim()
        .optional()
        .messages({
            "string.empty": "Name cannot be empty",
            "any.required": "Name is required",
        }),
    description: Joi.string()
        .required()
        .optional()
        .messages({
            "string.empty": "Description cannot be empty",
            "any.required": "Description is required",
        }),
    category: Joi.string()
        .valid("Vegetable", "Fruit", "Protein", "Grain", "Dairy", "Other")
        .required()
        .optional()
        .messages({
            "any.only": "Category must be one of: Vegetable, Fruit, Protein, Grain, Dairy, Other",
            "any.required": "Category is required",
        }),
});

module.exports = {
    ingredientSchema,
    updateIngredientSchema,
};
