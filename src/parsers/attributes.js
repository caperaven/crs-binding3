/**
 * @function
 * @description Parses a collection of attributes of an element and uses parseAttribute to parse them.
 * @param element {Element} - The element to parse.
 * @param context {Object} - The binding context.
 * @param ctxName {string} - The name of the context.
 * @param parentId {number} - The parent id.
 * @returns {Promise<void>}
 */
export async function parseAttributes(element, context, ctxName, parentId) {
    if (element.attributes == null) return;

    for (const attribute of element.attributes) {
        await crs.binding.parsers.parseAttribute(attribute, context, ctxName, parentId);
    }
}