/**
 * @function parseElements
 * @description Parses a collection of elements and uses parseElement to parse them.
 * @param collection {NodeList} - The collection of elements to parse.
 * @param context {Object} - The binding context.
 * @param options {Object} - The options.
 * @returns {Promise<void>}
 */
export async function parseElements(collection, context, options) {
    if (collection == null) return;

    for (let element of collection) {
        await crs.binding.parsers.parseElement(element, context, options);
    }
}