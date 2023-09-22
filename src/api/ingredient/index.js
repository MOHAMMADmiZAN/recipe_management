const {
    createIngredient,
    generateIngredientLinks,
    findAllIngredients,
    findIngredient, updateIngredient, deleteIngredient, totalIngredient
} = require('../../lib/index/service')
const {parseQueryParams, getPagination, getHATEOASForAllItems, getTransformedItems} = require("../../utils/query");

/**
 * Create a new index.
 *
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
const addIngredient = async (req, res, next) => {
    try {
        const { name, description, category } = req.body;
        const ingredient = await createIngredient({ name, description, category });
        res.status(201).json({
            code: 201,
            message: "Ingredient created successfully",
            data: {
                id: ingredient._id,
                name: ingredient.name,
                description: ingredient.description,
                category: ingredient.category,
            },
            links: generateIngredientLinks(ingredient._id, '/ingredients'),
        });
    } catch (e) {
        next(e);
    }
}

/**
 * Get a list of ingredients with optional filtering and pagination.
 *
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
const getIngredients = async (req, res, next) => {
    try {
        const queryOptions = parseQueryParams(req);
        const ingredients = await findAllIngredients(queryOptions);
        const data = getTransformedItems({
            items: ingredients,
            selection: ['name', 'description', 'category', '_id'],
            path: "/ingredients"
        });
        const totalItems = await totalIngredient(queryOptions.search);
        const pagination = getPagination({
            totalItems: totalItems,
            limit: queryOptions.limit,
            page: req.query.page || 1,
        });

        const links = getHATEOASForAllItems({
            url: req.url,
            path: "/ingredients",
            query: req.query,
            hasNext: !!pagination.next,
            hasPrev: !!pagination.prev,
            page: pagination.page,
        });

        res.status(200).json({
            code: 200,
            message: "Ingredients fetched successfully",
            data: data,
            pagination,
            links
        });
    } catch (e) {
        next(e);
    }
}

/**
 * Get details of a specific index by ID.
 *
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
const getIngredient = async (req, res, next) => {
    try {
        const { id } = req.params;

        console.log(`id: ${id}`)
        const ingredient = await findIngredient(id, ['name', 'description', 'category', 'createdAt', 'updatedAt']);
        if (!ingredient) {
            return res.status(404).json({
                code: 404,
                message: "Ingredient not found",
            });
        }
        res.status(200).json({
            code: 200,
            message: "Ingredient fetched successfully",
            data: {
                id: ingredient._id,
                name: ingredient.name,
                description: ingredient.description,
                category: ingredient.category,
            },
            links: generateIngredientLinks(ingredient._id, '/ingredients'),
        });
    } catch (e) {
        next(e);
    }
}

/**
 * Edit an existing index by ID.
 *
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
const editIngredient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, category } = req.body;
        const ingredient = await findIngredient(id, ['name', 'description', 'category']);
        if (!ingredient) {
            return res.status(404).json({
                code: 404,
                message: "Ingredient not found",
            });
        }
        const payload = {
            ...(name && { name }),
            ...(description && { description }),
            ...(category && { category }),
        };
        const updatedIngredient = await updateIngredient(id, payload);
        res.status(200).json({
            code: 200,
            message: "Ingredient updated successfully",
            data: {
                id: ingredient._id,
                name: updatedIngredient.name,
                description: updatedIngredient.description,
                category: updatedIngredient.category,
            },
            links: generateIngredientLinks(ingredient._id, '/ingredients'),
        });
    } catch (e) {
        next(e);
    }
}

/**
 * Remove an index by ID.
 *
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
const removeIngredient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ingredient = await findIngredient(id);
        if (!ingredient) {
            return res.status(404).json({
                code: 404,
                message: "Requested Ingredient not found",
            });
        }
        await deleteIngredient(id);
        res.status(200).json({
            code: 200,
            message: "Ingredient deleted successfully",
        });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    addIngredient,
    getIngredients,
    getIngredient,
    editIngredient,
    removeIngredient
};