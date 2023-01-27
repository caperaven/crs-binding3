import "../../expressions/code-factories/if.js";

/**
 * @class BindProvider - Binds an element to a property of a data object
 *
 * @example
 * <input value.bind="person.firstName">
 */
export default class BindProvider {
    #store = {};
    #onEventHandler = this.#onEvent.bind(this);

    /**
     * @constructor - Adds a change event listener to the document
     */
    constructor() {
        document.addEventListener("change", this.#onEventHandler);
    }

    /**
     * @property store - The store of element uuids and their properties to update
     * @returns {{}}
     */
    get store() {
        return this.#store;
    }

    /**
     * @method #onEvent - The event handler for the change event
     * @param event
     * @returns {Promise<void>}
     */
    async #onEvent(event) {
        const bid = event.target["__bid"];
        const field = event.target.dataset.field;

        if (bid == null || field == null) return;

        await crs.binding.data.setProperty(bid, field, event.target.value);
    }

    /**
     * @method parse - Parses the element and adds a change event listener to it and sets the data-field attribute
     * @param attr {Attr} - The attribute to parse
     * @param context {BindingContext} - The context of the element
     * @returns {Promise<void>}
     */
    async parse(attr, context) {
        const parts = attr.name.split(".");
        const element = attr.ownerElement;
        const property = parts[0];
        const path = attr.value;

        crs.binding.utils.markElement(element, context.bid);
        element.removeAttribute(attr.name);
        element.setAttribute("data-field", path);

        const eventObj = this.#store[element["__uuid"]] ||= {};
        eventObj[path] = property;

        crs.binding.data.setCallback(element["__uuid"], context.bid, [path]);
    }

    /**
     * @method update - Updates the element with the value of the property
     * @param uuid {string} - The uuid of the element
     * @param properties {string[]} - The properties to update
     * @returns {Promise<void>}
     */
    async update(uuid, ...properties) {
        const element = crs.binding.elements[uuid];
        if (element == null) return;

        const bid = element["__bid"];

        for (const property of properties) {
            const targetProperty = this.store[uuid]?.[property];
            if (targetProperty == null) continue;

            element[targetProperty] = await crs.binding.data.getProperty(bid, property) || "";
        }
    }

    /**
     * @method clear - Clears the element from the store
     * @param uuid {string} - The uuid of the element
     * @returns {Promise<void>}
     */
    async clear(uuid) {
        delete this.#store[uuid];
    }
}