const {
    createRecipe,
    recipeLinkGenerator,
    findAllRecipe,
    findRecipe,
    totalRecipe,
    updateRecipeById,
    deleteRecipeById
} = require("../../lib/recipe")
const {parseQueryParams, getTransformedItems, getPagination, getHATEOASForAllItems} = require("../../utils/query");
const {transformRecipe, fetchAndTransformRecipe, parseExpandQuery, expandFields} = require("./utility");
const {handleErrors} = require("../../utils/error");


/**
 * Controller for creating a recipe.
 *
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
const addRecipe = async (req, res, next) => {
    try {
        const { title, ingredients, instructions } = req.body;
        const { user } = req;

        // Create the payload for the new recipe
        const payload = {
            title,
            ingredients,
            instructions,
            creator: user._id,
        };

        // Create the recipe
        const recipe = await createRecipe(payload);

        // Transform the recipe data and generate links
        const transformedRecipe = await transformRecipe(recipe);

        // Return the response with the transformed data
        res.status(201).json({
            code: 201,
            message: "Recipe created successfully",
            data: transformedRecipe,
            links: recipeLinkGenerator(transformedRecipe._id, '/recipes'),
        });
    } catch (e) {
        next(e);
    }
};

/**
 * Controller for fetching a recipe by ID.
 *
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
const getRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;
        const expand = expandFields(req.query.expand);
        const transformedRecipe = await fetchAndTransformRecipe(id, expand);
        res.status(200).json({
            code: 200,
            message: "Recipe fetched successfully",
            data: transformedRecipe,
            links: recipeLinkGenerator(transformedRecipe._id, '/recipes'),
        });
    } catch (e) {
        next(e);
    }
};

/**
 * Controller for fetching multiple recipes with pagination.
 *
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
const getRecipes = async (req, res, next) => {
    try {
        // Parse query parameters
        const queryOptions = parseQueryParams(req);
        const expand = expandFields(req.query.expand);

        // Find all recipes based on query options
        const recipes = await findAllRecipe(queryOptions);

        // Transform all recipes and generate links
        const transformedRecipes = await Promise.all(recipes.map((recipe) => transformRecipe(recipe, expand)));

        // Get transformed data for selected fields
        const data = getTransformedItems({
            items: transformedRecipes,
            selection: ['title', 'ingredients', 'instructions', 'creator', '_id'],
            path: "/recipes",
        });

        const total = await totalRecipe(queryOptions.search);

        // Calculate pagination data
        const pagination = getPagination({
            totalItems: total,
            limit: queryOptions.limit,
            page: req.query.page || 1,
        });

        // Generate HATEOAS links
        const links = getHATEOASForAllItems({
            url: req.url,
            path: "/recipes",
            query: req.query,
            hasNext: !!pagination.next,
            hasPrev: !!pagination.prev,
            page: pagination.page,
        });

        // Send the response with transformed data
        res.status(200).json({
            code: 200,
            message: "Recipes fetched successfully",
            data,
            pagination,
            links,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * Controller for updating a recipe by ID.
 *
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
const updateRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, ingredients, instructions } = req.body;

        // Find the existing recipe
        const recipe = await findRecipe(id, ["title", "ingredients", "instructions"]);

        // Check if the recipe exists
        if (!recipe) {
            return handleErrors(res, new Error("Recipe not found"), 404);
        }

        // Create a payload with updated data (or use the existing data if not provided)
        const updatedData = {
            title: title || recipe.title,
            ingredients: ingredients || recipe.ingredients,
            instructions: instructions || recipe.instructions
        };

        // Update the recipe
        const updatedRecipe = await updateRecipeById(id, updatedData);

        // Transform the updated recipe
        const transformedRecipe = await transformRecipe(updatedRecipe);

        res.status(200).json({
            code: 200,
            message: "Recipe updated successfully",
            data: transformedRecipe,
            links: recipeLinkGenerator(transformedRecipe._id, '/recipes'),
        });
    } catch (e) {
        next(e);
    }
};

/**
 * Controller for deleting a recipe by ID.
 *
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
const deleteRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Find the existing recipe
        const recipe = await findRecipe(id);

        // Check if the recipe exists
        if (!recipe) {
            return handleErrors(res, new Error("Recipe not found"), 404);
        }

        // Delete the recipe
        await deleteRecipeById(id)

        res.status(200).json({
            code: 200,
            message: "Recipe deleted successfully",
        });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    addRecipe,
    getRecipe,
    getRecipes,
    updateRecipe,
    deleteRecipe
};
