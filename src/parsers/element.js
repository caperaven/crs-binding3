export async function parseElement(element, context, options) {
    if (element["__inflated"] === true) return;

    let ctxName = options?.ctxName || "context";

    // 1. check if there is a custom element provider.
    // If there is, use that and ignore the other providers
    const elementProvider = await crs.binding.providers.getElementProvider(element);

    if (elementProvider != null) {
        element["__uuid"] ||= crypto.randomUUID();
        element["__bid"] ||= context.bid;
        return elementProvider.parse(element, context, ctxName);
    }

    // 2. Should this element be ignored.
    // If so, don't parse anything further.
    if (ignore(element)) {
        console.log("ignore:", element.nodeName);
        return;
    }

    // 3. Parse the attributes
    await crs.binding.parsers.parseAttributes(element, context, ctxName);

    if (element.children?.length > 0) {
        return await crs.binding.parsers.parseElements(element.children, context, options);
    }

    // 4. If there are no children then check the textContent for processing
    for (const provider of crs.binding.providers.textProviders) {
        await provider.parseElement(element, context, ctxName)
    }
}

function ignore(element) {
    for (const query of crs.binding.ignore) {
        if (element.matches(query)) {
            return true;
        }
    }

    return false;
}