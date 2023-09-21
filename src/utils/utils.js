const populateFields = async (document, transformations) => {
    for (const [field, selectFields] of Object.entries(transformations)) {
        if (Array.isArray(selectFields)) {
            const stringFields = selectFields.filter(f => typeof f === "string");
            await document.populate(field, stringFields);
        }
    }
};

module.exports = {
    populateFields
}