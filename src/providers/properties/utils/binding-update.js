export async function bindingUpdate(uuid, store, ...properties) {
    const element = crs.binding.elements[uuid];
    if (element == null) return;

    const bid = element["__bid"];

    if (properties.length === 0) {
        properties = Object.keys(store[uuid]);
    }

    for (const property of properties) {
        const targetProperty = store[uuid]?.[property];
        if (targetProperty == null) continue;

        element[targetProperty] = await crs.binding.data.getProperty(bid, property) || "";
    }
}