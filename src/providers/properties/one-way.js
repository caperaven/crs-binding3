import {bindingUpdate} from "./utils/binding-update.js";
import {bindingParse} from "./utils/binding-parse.js";

/**
 * @class OneWayProvider - Provides one-way binding
 *
 * @example
 * <component value.one-way="property"></component>
 */
export default class OneWayProvider {
    #store = {};

    /**
     * @property store - The store of element uuids and their properties to update
     * @returns {{}}
     */
    get store() {
        return this.#store;
    }

    /**
     * @method parse - Parses the element and adds a change event listener to it and sets the data-field attribute
     * @param attr {Attr} - The attribute to parse
     * @param context {BindingContext} - The context of the element
     * @returns {Promise<void>}
     */
    async parse(attr, context) {
        await bindingParse(attr, context, ".one-way");
    }

    /**
     * @method update - Updates the element with the value of the property
     * @param uuid {string} - The uuid of the element
     * @param properties {string[]} - The properties to update
     * @returns {Promise<void>}
     */
    async update(uuid, ...properties) {
        await bindingUpdate(uuid, this.#store, ...properties);
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