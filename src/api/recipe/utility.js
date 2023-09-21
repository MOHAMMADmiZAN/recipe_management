const {populateFields} = require("../../utils/utils");
const {findRecipe} = require("../../lib/recipe");
/**
 * Transform a recipe by populating specified fields and generating links.
 *
 * @param {Object} recipe - The recipe object to transform.
 * @param {Object} populateData - Data to specify which fields to populate.
 * @returns {Promise<Object>} - Transformed recipe data.
 */
const transformRecipe = async (recipe, populateData) => {
    // Populate fields for the recipe
    if (populateData && Object.keys(populateData).length > 0) {
        await populateFields(recipe, populateData);
    }

    // Utility function to generate links
    const getLink = (model, field) => `/${field}s/${model._id}`;

    // Transform and return the recipe data
    return {
        ...recipe._doc,
        creator: recipe._doc.creator._doc ? {
            ...recipe._doc.creator._doc,
            links: getLink(recipe._doc.creator._doc, 'user')
        } : recipe._doc.creator,
        ingredients: recipe._doc.ingredients.map((ingredient) => ({
            ...ingredient._doc,
            ingredient: ingredient._doc.ingredient._doc ? {
                ...ingredient._doc.ingredient._doc,
                links: getLink(ingredient._doc.ingredient._doc, 'ingredient')
            } : ingredient._doc.ingredient,
        })),
    };
};

/**
 * Fetch and transform a recipe by its ID.
 *
 * @param {string} id - The ID of the recipe to fetch and transform.
 * @param {Object} expandData - Data specifying which fields to expand.
 * @returns {Promise<Object>} - Transformed recipe data.
 */
const fetchAndTransformRecipe = async (id, expandData) => {
    const recipe = await findRecipe(id, ['title', 'ingredients', 'instructions', 'creator', '_id']);
    if (!recipe) {
        const error = new Error("Recipe not found");
        error.statusCode = 404;
        throw error;
    }
    return transformRecipe(recipe, expandData);
};

/**
 * Expand fields from a query string into an object.
 *
 * @param {string} fields - The query string containing fields to expand.
 * @returns {Object} - An object representing expanded fields.
 */
function expandFields(fields) {
    if (!fields) {
        return {};
    }
    return fields.trim().split("&").reduce((result, fieldPath) => {
        const [fieldName, values] = fieldPath.split("=");
        result[fieldName] = values.split(",");
        return result;
    }, {});
}

module.exports = {
    transformRecipe,
    fetchAndTransformRecipe,
    expandFields,
};