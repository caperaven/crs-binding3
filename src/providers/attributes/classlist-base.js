export class ClassListBase {
    #store = {};

    get store() { return this.#store; }

    /**
     * @method parse - Parses the attribute and adds it to the store.
     * @param attr {Attribute} - The attribute to parse.
     * @param context {Context} - The context of the attribute.
     * @param callback {Function} - The callback to parse the attribute.
     * @returns {Promise<void>}
     */
    async parse(attr, context, classes, callback) {
        const element = attr.ownerElement;
        element.removeAttribute(attr.name);
        crs.binding.utils.markElement(element, context);
        const expo = await callback(attr.value);

        this.#store[element["__uuid"]] = {
            classes,
            fnKey: expo.key
        };

        crs.binding.data.setCallback(element["__uuid"], context.bid, expo.parameters.properties, this.providerKey);
    }

    /**
     * @method update - Updates the store for the given uuid.
     * @param uuid {string} - The uuid of the element.
     * @returns {Promise<void>}
     */
    async update(uuid) {
        if (this.#store[uuid] == null) return;

        const element = crs.binding.elements[uuid];
        const data = crs.binding.data.getDataForElement(element);
        const storeItem = this.#store[uuid];
        const expo = crs.binding.functions.get(storeItem.fnKey);
        const result = await expo.function(data);

        // remove all the classes from the element
        element.classList.remove(...storeItem.classes);

        if (result != null) {
            const classes = Array.isArray(result) ? result : [result];
            element.classList.add(...classes);
        }
    }

    /**
     * @method clear - Clears the store for the given uuid.
     * @param uuid {string} - The uuid of the element.
     * @returns {Promise<void>}
     */
    async clear(uuid) {

    }
}