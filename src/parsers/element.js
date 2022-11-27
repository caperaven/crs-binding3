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

    const elementProvider = await crs.binding.providers.getElementProvider(element);

    if (elementProvider != null) {
        return elementProvider.parse(element, context, ctxName, parentId);
    }

    if (ignore(element)) {
        console.log("ignore:", element.nodeName);
        return;
    }

    if ((element.nodeName !== "TEMPLATE" && element.nodeName !== "PERSPECTIVE-ELEMENT") && element.children?.length > 0) {
        await crs.binding.parsers.parseElements(element.children, context, options);
    }

    await crs.binding.parsers.parseAttributes(element, context, ctxName, parentId);
}

function ignore(element) {
    for (const query of crs.binding.ignore) {
        if (element.matches(query)) {
            return true;
        }
    }

    return false;
}