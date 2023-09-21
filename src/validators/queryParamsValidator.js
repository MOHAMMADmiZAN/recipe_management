const Joi = require("joi");

// Define a Joi schema for query parameter validation with custom error messages
const queryParamsSchema = Joi.object({
  page: Joi.number()
      .integer()
      .min(1)
      .messages({
        "number.base": "Page number should be a number",
        "number.integer": "Page number should be an integer",
        "number.min": "Page number should be at least 1",
      }),
  limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .messages({
        "number.base": "Limit should be a number",
        "number.integer": "Limit should be an integer",
        "number.min": "Limit should be at least 1",
        "number.max": "Limit should not exceed 100",
      }),
  sort: Joi.string()
      .valid("asc", "desc")
      .messages({
        "any.only": "Sort can only be 'asc' or 'desc'",
      }),
  search: Joi.string()
      .min(1)
      .max(100)
      .optional()
      .messages({
        "string.min": "Search keyword should be at least 1 character long",
        "string.max": "Search keyword should not exceed 100 characters",
      }),
});

module.exports = queryParamsSchema;
