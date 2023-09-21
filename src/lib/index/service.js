const Ingredient = require('../../model/Ingredient');
const { createLinkGenerator } = require("../../utils/linkGenerator");

/**
 * Create a new index.
 *
 * @param {Object} ingredient - The index data to create.
 * @returns {Promise<Object>} - The created index.
 */
const createIngredient = async (ingredient) => {
    const newIngredient = new Ingredient(ingredient);
    const savedIngredient = await newIngredient.save();
    return savedIngredient._doc;
}

/**
 * Generate links for ingredients.
 *
 * @type {function}
 */
const generateIngredientLinks = createLinkGenerator();

/**
 * Find all ingredients based on query parameters.
 *
 * @param {Object} query - Query parameters like skip, limit, sort, and search.
 * @returns {Promise<Array>} - An array of ingredients matching the query.
 */
const findAllIngredients = async (query) => {
    const { skip, limit, sort, search } = query;
    const queryOptions = {
        ...(limit && { limit: parseInt(limit) }),
        ...(skip && { skip: parseInt(skip) }),
        ...(sort && { sort: sort }),
    };

    const searchFilter = search ? { name: { $regex: new RegExp(search, 'i') } } : {};

    return await Ingredient.find(searchFilter, null, queryOptions);
}

/**
 * Find an index by its value (either _id or name).
 *
 * @param {string|Object} value - The value to search for (can be _id or name).
 * @param {Array} selectFields - Fields to select in the result.
 * @returns {Promise<Object|null>} - The found index or null if not found.
 */
const findIngredient = async (value, selectFields = []) => {
    // If value is not an object, assume it's the name
    const key = typeof value === 'object' ? Object.keys(value)[0] : '_id';
    value = typeof value === 'object' ? Object.values(value)[0] : value;

    // Create a filter object based on the provided key and value
    const filter = { [key]: value };

    // Create a projection to select fields to return
    let projection = '_id'; // Always select the _id field by default

    if (selectFields.length > 0) {
        // If selectFields array is provided, add them to the projection
        projection += ' ' + selectFields.join(' ');
    }
    return await Ingredient.findOne(filter).select(projection);
}

/**
 * Update an index by its ID.
 *
 * @param {string} id - The ID of the index to update.
 * @param {Object} ingredient - The updated index data.
 * @returns {Promise<Object|null>} - The updated index or null if not found.
 */
const updateIngredient = async (id, ingredient) => {
    const filter = { _id: id };
    const update = { ...ingredient };
    const options = { new: true };
    return await Ingredient.findOneAndUpdate(filter, update, options);
}

/**
 * Delete an index by its ID.
 *
 * @param {string} id - The ID of the index to delete.
 * @returns {Promise<Object|null>} - The deleted index or null if not found.
 */
const deleteIngredient = async (id) => {
    return Ingredient.findByIdAndDelete(id);
}

/**
 * Get the total count of ingredients matching a search query.
 *
 * @param {string} searchQuery - The search query for ingredients.
 * @returns {Promise<number>} - The total count of ingredients.
 */
const totalIngredient = async (searchQuery) => {
    const searchFilter = searchQuery ? { name: { $regex: new RegExp(searchQuery, 'i') } } : {};
    const totalCount = await Ingredient.countDocuments(searchFilter);
    return totalCount;
}

module.exports = {
    createIngredient,
    generateIngredientLinks,
    findAllIngredients,
    findIngredient,
    updateIngredient,
    deleteIngredient,
    totalIngredient
}
