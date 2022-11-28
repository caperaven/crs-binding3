export async function parseAttributes(element, context, ctxName, parentId) {
    if (element.attributes == null) return;

    for (const attribute of element.attributes) {
        await crs.binding.parsers.parseAttribute(attribute, context, ctxName, parentId);
    }
}