const ignoreElements = ["STYLE", "CRS-ROUTER", "SCRIPT"];

/**
 * @function parseElement - Parses an element and its children.
 * This will manage the parsing of textContent, attributes and child elements.
 * Some elements will not be parsed, such as STYLE and CRS-ROUTER.
 * 
 * @param element {Element} - The element to parse.
 * @param context {Object} - The binding context.
 * @param options {Object} - The options.
 * @returns {Promise<void|*>}
 */
export async function parseElement(element, context, options) {
    if (element["__inflated"] === true || ignoreElements.indexOf(element.nodeName) != -1) return;

    if (element.dataset.ref != null) {
        context[element.dataset.ref] = element;
    }

    let ctxName = options?.ctxName || "context";

    // 1. check if there is a custom element provider.
    // If there is, use that and ignore the other providers
    const elementProvider = await crs.binding.providers.getElementProvider(element);

    if (elementProvider != null) {
        return elementProvider.parse(element, context, ctxName);
    }

    // 2. Should this element be ignored.
    // If so, don't parse anything further.
    if (ignore(element, crs.binding.ignore)) {
        return;
    }

    // 3. Parse the attributes
    await crs.binding.parsers.parseAttributes(element, context, ctxName);

    if(element.__uuid != null && options?.uuids != null) {
        options.uuids.add(element.__uuid);
    }

    if (ignore(element, crs.binding.ignoreChildren) || element instanceof crs.classes.BindableElement === true) {
        return;
    }

    if (element.children?.length > 0) {
        await crs.binding.parsers.parseElements(element.children, context, options);
        if (element.parseCompleted != null) {
            await element.parseCompleted(context);
        }
        return;
    }

    // 4. If there are no children then check the textContent for processing
    for (const provider of crs.binding.providers.textProviders) {
        await provider.parseElement(element, context, ctxName)
    }
}

function ignore(element, options) {
    for (const query of options) {
        if (element.matches(query)) {
            return true;
        }
    }

    return false;
}
