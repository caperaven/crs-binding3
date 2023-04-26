/**
 * @function markElement - Mark an element with a unique id and a binding id.
 * When a element has binding on it we need to mark it so that the binding engine knows how to handle it.
 * @param element {HTMLElement} - The element to mark.
 * @param bid {string} - The binding id.
 * @returns {string} - The uuid of the element.
 */
export function markElement(element, context) {
    const bid = context.bid;
    if (element["__uuid"] == null) {
        element["__uuid"] ||= crypto.randomUUID();
        crs.binding.elements[element["__uuid"]] = element;
    }

    element["__bid"] ||= bid;

    context.boundElements ||= new Set();
    context.boundElements.add(element["__uuid"]);

    return element["__uuid"];
}

/**
 * @function unmarkElement - Unmark an element.
 * This will remove the uuid and bid from the element.
 * It will also remove the element from the binding engine and the element becomes irrelevant to the binding engine.
 * @param element {HTMLElement} - The element to unmark.
 */
export function unmarkElement(element) {
    if (element.nodeName === "STYLE") return;

    if (element.children.length > 0) {
        unmarkElements(element.children);
    }

    const uuid = element["__uuid"];
    if (uuid == null) return;

    crs.binding.providers.clear(uuid).catch(error => console.error(error));

    if (crs.binding.elements[uuid]) {
        delete crs.binding.elements[uuid];
    }
}

/**
 * @function unmarkElements - This is a batch operation that un-marks multiple elements.
 * @param elements {NodeListOf<HTMLElement>} - The elements to unmark.
 */
export function unmarkElements(elements) {
    for (const element of elements) {
        unmarkElement(element);
    }
}