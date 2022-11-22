export async function parseAttributes(element, context, ctxName, parentId) {
    if (element.attributes == null) return;

    const boundAttributes = Array.from(element.attributes).filter(attr =>
        (attr.ownerElement.tagName.toLowerCase() == "template" && attr.name == "for") ||
        (attr.name == "ref") ||
        (attr.name.indexOf(".") != -1) ||
        ((attr.value || "").indexOf("${") == 0) ||
        ((attr.value || "").indexOf("&{") == 0)
    );

    for (const attribute of boundAttributes) {
        await crs.binding.parsers.parseAttribute(attribute, context, ctxName, parentId);
    }
}