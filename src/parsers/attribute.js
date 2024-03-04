/**
 * @function parseAttribute
 * @description Parses an attribute and calls the provider to handle it.
 * @param attr {Attr} - The attribute to parse.
 * @param context {Object} - The binding context.
 * @param ctxName {string} - The name of the context.
 * @param parentId {number} - The parent id.
 * @returns {Promise<void>}
 */
export async function parseAttribute(attr, context, ctxName, parentId) {
    if (attr.ownerElement == null) return;

    const provider = await crs.binding.providers.getAttrProvider(attr.name, attr.value);

    if (provider == null) return;

    const element = attr.ownerElement;
    crs.binding.utils.markElement(element, context);

    await provider.parse(attr, context, ctxName, parentId);
}