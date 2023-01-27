/**
 * @class AttrProvider
 * @description Attribute binding provider for binding attributes to data.
 *
 * @example
 * <div data-value.bind="age"></div>
 */
export default class AttrProvider {
    #store = {};

    get store() { return this.#store; }

    /**
     * Parses the attribute and sets the callback for the data.
     * The callback will be called when the data changes and the attribute will be updated.
     * @param attr {Attr} - The attribute to parse.
     * @param context {BindingContext} - The context of the binding.
     * @returns {Promise<void>}
     */
    async parse(attr, context) {
        const attrName = attr.name.split(".")[0];
        const element = attr.ownerElement;
        element.removeAttribute(attr.name);

        crs.binding.utils.markElement(element, context.bid);
        const expo = await crs.binding.expression.compile(attr.value);
        const obj = this.#store[element["__uuid"]] ||= {};

        for (const property of expo.parameters.properties) {
            obj[property] = {
                [attrName]: expo.key
            }
        }

        crs.binding.data.setCallback(element["__uuid"], context.bid, expo.parameters.properties);
    }

    /**
     * Updates the attribute of the element for the given properties.
     * @param uuid {string} - The uuid of the element.
     * @param properties {string[]} - The properties to update.
     * @returns {Promise<void>}
     */
    async update(uuid, ...properties) {
        if (this.#store[uuid] == null) return;

        const element = crs.binding.elements[uuid];
        const data = crs.binding.data.getDataForElement(element);
        const storeItem  = this.#store[uuid];

        for (const property of properties) {
            if (storeItem[property] == null) continue;

            const attributes = Object.keys(storeItem[property]);
            for (const attribute of attributes) {
                const fnKey = storeItem[property][attribute];
                const expo = crs.binding.functions.get(fnKey);
                const result = await expo.function(data);
                element.setAttribute(attribute, result);
            }
        }
    }

    /**
     * Clears the store for the given uuid.
     * @param uuid {string} - The uuid of the element.
     * @returns {Promise<void>}
     */
    async clear(uuid) {
        delete this.#store[uuid];
    }
}