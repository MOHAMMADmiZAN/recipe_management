
/**
 * Generates dynamic resource links based on a base URL and link definitions.
 *
 * @param {Object} linkDefinitions - An object containing link definitions.
 * @returns {Function} - A link generation function.
 */

const Definitions = {
    self: {
        rel: 'self',
        href: '',
        method: 'GET',
    },
    update: {
        rel: 'update',
        href: '',
        method: 'PUT',
    },
    delete: {
        rel: 'delete',
        href: '',
        method: 'DELETE',
    },
};
function createLinkGenerator(linkDefinitions=Definitions) {
    return (resourceId, baseUrl) => {
        const generatedLinks = {};

        for (const key in linkDefinitions) {
            if (linkDefinitions.hasOwnProperty(key)) {
                const linkDefinition = linkDefinitions[key];
                generatedLinks[key] = {
                    rel: linkDefinition.rel,
                    href: `${baseUrl}/${resourceId}${linkDefinition.href}`, // Include resourceId in href
                    method: linkDefinition.method,
                };
            }
        }

        return generatedLinks;
    };
}

module.exports = {
    createLinkGenerator,
};
