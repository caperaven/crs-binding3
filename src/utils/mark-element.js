export function markElement(element, bid) {
    if (element["__uuid"] == null) {
        element["__uuid"] ||= crypto.randomUUID();
        crs.binding.elements[element["__uuid"]] = element;
    }

    element["__bid"] ||= bid;
}

export function unmarkElement(element) {
    const uuid = element["__uuid"];
    if (uuid == null) return;

    if (crs.binding.elements[uuid]) {
        crs.binding.elements[uuid] = null;
    }

    delete crs.binding.elements[uuid];
}