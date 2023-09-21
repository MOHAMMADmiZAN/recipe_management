const Recipe = require("../../model/Recipe");
const { createLinkGenerator } = require("../../utils/linkGenerator");

/**
 * Create a new recipe.
 *
 * @param {Object} payload - The recipe data to create.
 * @returns {Promise<Object>} - The created recipe.
 */
const createRecipe = async (payload) => {
    const { title, ingredients, instructions, creator } = payload;
    const recipe = new Recipe({
        title,
        ingredients,
        instructions,
        creator
    });
    return await recipe.save();
}

/**
 * Generate links for recipes.
 *
 * @type {function}
 */
const recipeLinkGenerator = createLinkGenerator();

/**
 * Find all recipes based on query parameters.
 *
 * @param {Object} query - Query parameters like skip, limit, sort, and search.
 * @returns {Promise<Array>} - An array of recipes matching the query.
 */
const findAllRecipe = async (query) => {
    const { skip, limit, sort, search } = query;
    const queryOptions = {
        ...(limit && { limit: parseInt(limit) }),
        ...(skip && { skip: parseInt(skip) }),
        ...(sort && { sort: sort }),
    };

    const searchFilter = search ? { title: { $regex: new RegExp(search, 'i') } } : {};

    return await Recipe.find(searchFilter, null, queryOptions);
};

/**
 * Find a recipe by its value (either _id or title).
 *
 * @param {string|Object} value - The value to search for (can be _id or title).
 * @param {Array} selectFields - Fields to select in the result.
 * @returns {Promise<Object|null>} - The found recipe or null if not found.
 */
const findRecipe = async (value, selectFields = []) => {
    // If value is not an object, assume it's the title
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
    return await Recipe.findOne(filter).select(projection);
};

/**
 * Update a recipe by its ID.
 *
 * @param {string} id - The ID of the recipe to update.
 * @param {Object} payload - The updated recipe data.
 * @returns {Promise<Object|null>} - The updated recipe or null if not found.
 */
const updateRecipeById = async (id, payload) => {
    return await Recipe.findByIdAndUpdate(id, payload, { new: true }).select('-__v');
}

/**
 * Get the total count of recipes matching a search query.
 *
 * @param {string} searchQuery - The search query for recipes.
 * @returns {Promise<number>} - The total count of recipes.
 */
const totalRecipe = async (searchQuery) => {
    const searchFilter = searchQuery ? { title: { $regex: new RegExp(searchQuery, 'i') } } : {};
    const totalCount = await Recipe.countDocuments(searchFilter);
    return totalCount;
};

/**
 * Delete a recipe by its ID.
 *
 * @param {string} id - The ID of the recipe to delete.
 * @returns {Promise<Object|null>} - The deleted recipe or null if not found.
 */
const deleteRecipeById = async (id) => {
    return await Recipe.findByIdAndDelete(id);
}

module.exports = {
    createRecipe,
    recipeLinkGenerator,
    findAllRecipe,
    findRecipe,
    updateRecipeById,
    totalRecipe,
    deleteRecipeById
}
