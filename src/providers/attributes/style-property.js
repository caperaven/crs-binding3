/**
 * @class StyleProvider
 * @description Set the style of an element based on a property value on the binding context.
 * When the property value changes the style will be updated.
 *
 * @example <caption>style expression</caption>
 * <div style.background.one-way="bgcolor"></div>
 */
export default class StyleProvider {
    #store = {};

    get store() { return this.#store; }

    async parse(attr, context) {
        const parts = attr.name.split(".");
        const element = attr.ownerElement;
        element.removeAttribute(attr.name);

        const cssProperty = parts[1];
        crs.binding.utils.markElement(element, context);
        const expo = await crs.binding.expression.compile(attr.value);
        const obj = this.#store[element["__uuid"]] ||= {};
        obj[cssProperty] = expo.key;

        crs.binding.data.setCallback(element["__uuid"], context.bid, expo.parameters.properties, "style.");
    }

    async update(uuid) {
        if (this.#store[uuid] == null) return;

        const element = crs.binding.elements[uuid];
        const data = crs.binding.data.getDataForElement(element);

        for (const [cssProperty, fnKey] of Object.entries(this.#store[uuid])) {
            const expo = crs.binding.functions.get(fnKey);
            const result = await expo.function(data);
            element.style[cssProperty] = result;
        }
    }

    /**
     * Clears the store for the given uuid.
     * @param uuid {string} - The uuid of the element.
     * @returns {Promise<void>}
     */
    async clear(uuid) {
        const obj = this.#store[uuid];

        if (obj == null) return;

        for (const fnKey of Object.values(obj)) {
            const exp = crs.binding.functions.get(fnKey);
            crs.binding.expression.release(exp);
        }

        delete this.#store[uuid];
    }
}