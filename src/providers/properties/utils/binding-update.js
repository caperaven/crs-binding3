export async function bindingUpdate(uuid) {
    const element = crs.binding.elements[uuid];
    if (element == null) return;

    let intent = crs.binding.eventStore.getIntent("change", uuid);
    intent ||= crs.binding.eventStore.getIntent("component-change", uuid);

    if (Array.isArray(intent)) {
        for (const i of intent) {
            await applyProperty(element, i);
        }

        return;
    }

    await applyProperty(element, intent);
}

async function applyProperty(element, intent) {
    const properties = Object.keys(intent.value);

    const emptyProperty = ["value", "textContent", "innerText", "innerHTML"];

    for (const property of properties) {
        const targetProperty = intent.value[property];
        if (targetProperty == null) continue;

        const value = emptyProperty.includes(targetProperty) === true ? "" : null;

        element[targetProperty] = await crs.binding.data.getProperty(element["__bid"], property) ?? value;
    }
}