export async function parseElement(element, context, options) {
    if (element["__inflated"] === true) return;

    let ctxName = "context";
    let parentId = null;
    let folder = null;

    if (options != null) {
        ctxName = options["ctxName"] || "context";
        parentId = options["parentId"] || null;
        folder = options["folder"] || null; // required for template parsing
    }

    const nodeName = element.nodeName.toLowerCase();

    if ((nodeName !== "template" && nodeName !== "perspective-element") && element.children?.length > 0) {
        await crs.binding.parsers.parseElements(element.children, context, options);
    }

    await crs.binding.parsers.parseAttributes(element, context, ctxName, parentId);
}