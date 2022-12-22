export function markElement(element, bid) {
    if (element["__uuid"] == null) {
        element["__uuid"] ||= crypto.randomUUID();
        crs.binding.elements[element["__uuid"]] = element;
    }

    element["__bid"] ||= bid;
    return element["__uuid"];
}

export function unmarkElement(element) {
    if (element.children.length > 0) {
        unmarkElements(element.children);
    }

    const uuid = element["__uuid"];
    if (uuid == null) return;

    if (crs.binding.elements[uuid]) {
        crs.binding.elements[uuid] = null;
    }

    delete crs.binding.elements[uuid];
}

export function unmarkElements(elements) {
    for (const element of elements) {
        unmarkElement(element);
    }
}