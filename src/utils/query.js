const generateQueryString = require("./qs");
const defaults = require('../config/defaults');
const {errorHandler} = require("./error");
/**
 * Calculate pagination information.
 *
 * @param {Object} options - Pagination options.
 * @param {number} options.totalItems - Total number of items.
 * @param {number} options.limit - Items per page.
 * @param {number} options.page - Current page.
 * @returns {Object} Pagination information.
 */
const getPagination = ({totalItems = defaults.totalItems, limit = defaults.limit, page = defaults.page}) => {
    page = Number(page);
    const totalPage = Math.ceil(totalItems / limit);
    const hasNext = page < totalPage;
    const hasPrev = page > 1;



    return {
        page,
        limit,
        totalItems,
        totalPage,
        ...(hasNext && {next: page + 1}),
        ...(hasPrev && {prev: page - 1}),
    };
};

/**
 * Generate HATEOAS links for pagination.
 *
 * @param {Object} options - Options for generating links.
 * @param {string} options.url - Base URL.
 * @param {string} options.path - Resource path.
 * @param {Object} options.query - Query parameters.
 * @param {boolean} options.hasNext - Whether there is a next page.
 * @param {boolean} options.hasPrev - Whether there is a previous page.
 * @param {number} options.page - Current page.
 * @returns {Object} HATEOAS links.
 */
const getHATEOASForAllItems = ({url = '/', path = '', query = {}, page = 1,hasNext,hasPrev}) => {

     const  generateQuery = (query) => {
         const { limit = defaults.limit, sort = defaults.sort, sort_type = defaults.sortType, ...rest } = query;

         return { limit, sort, sort_type, ...rest };

     }
    // Create self link with query parameters and page
    const queryStr = generateQueryString({...generateQuery(query),page});
    const selfLink = `${path}?${queryStr}`;

    // Initialize the links object with the self link
    const links = { self: selfLink };

    /**
     * Add a link if a condition is met.
     *
     * @param {boolean} condition - Condition to check.
     * @param {string} key - Link key.
     * @param {number} value - Page number.
     */
    const addLink = (condition, key, value) => {
        if (condition) {
            const queryStr = generateQueryString({...generateQuery(query), page: value});
            links[key] = `${path}?${queryStr}`;
        }
    };

    addLink(hasNext, 'next', page + 1);
    addLink(hasPrev, 'prev', page - 1);

    return links;
};

/**
 * Transform items with selected properties and add links.
 *
 * @param {Object} options - Transformation options.
 * @param {Array} options.items - Items to transform.
 * @param {Array} options.selection - Selected properties.
 * @param {string} options.path - Base path.
 * @returns {Array} Transformed items with links.
 */
const getTransformedItems = ({items = [], selection = [], path = '/'}) => {
    if (!Array.isArray(items) || !Array.isArray(selection)) {
        throw new Error('Invalid selection');
    }

    return items.map((item) => {
        const result = {};
        selection.forEach((key) => {
            result[key] = item[key];
        });
        result.link = `${path}/${item.id || item._id}`;
        return result;
    });
};

/**
 * Parse and validate query parameters for pagination, sorting, and search.
 *
 * @param {import('express').Request} req - Express request object.
 * @returns {Object} - An object containing validated query parameters.
 */
const parseQueryParams = (req) => {
    let {page, limit, sort, search, sort_type} = req.query;
     page = page || defaults.page;
     limit = limit || defaults.limit;
     sort = sort || defaults.sort;
     sort_type = sort_type || defaults.sortType;

    const queryParams = {};
    if (page && limit) {
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);

        if (!isNaN(parsedPage) && !isNaN(parsedLimit) && parsedPage > 0 && parsedLimit > 0) {
            queryParams.skip = (parsedPage - 1) * parsedLimit;
            queryParams.limit = parsedLimit;
        }
    }
    if (sort) {
        try {
            queryParams.sort = {};
            queryParams.sort[sort] = sort_type === 'dsc' ? -1 : 1;
        } catch (error) {
            errorHandler(`Invalid sort parameter: ${error.message}`, 400);
        }
    }

    if (search) {
        queryParams.search = search;
    }
    if (page) {
        queryParams.page = page;
    }

    return queryParams;
};
module.exports = {
    getPagination,
    getTransformedItems,
    getHATEOASForAllItems,
    parseQueryParams,
};
