import "../../expressions/code-factories/if.js";
import {bindingUpdate} from "./utils/binding-update.js";
import {bindingParse} from "./utils/binding-parse.js";

/**
 * @class BindProvider - Binds an element to a property of a data object
 *
 * @example
 * <input value.bind="person.firstName">
 */
export default class BindProvider {
    /**
     * @method #onEvent - The event handler for the change event
     * @param event
     * @returns {Promise<void>}
     */
    async onEvent(event, bid, intent, target) {
        const field = target.dataset.field;
        if (bid == null || field == null) return;

        let value = target.value;
        if (target.nodeName === "INPUT") {
            if (target.type === "checkbox") {
                value = target.checked;
            }

            if (target.type === "number") {
                value = Number(value);
            }
        }

        await crs.binding.data.setProperty(bid, field, value);
    }

    /**
     * @method parse - Parses the element and adds a change event listener to it and sets the data-field attribute
     * @param attr {Attr} - The attribute to parse
     * @param context {BindingContext} - The context of the element
     * @returns {Promise<void>}
     */
    async parse(attr, context) {
        await bindingParse(attr, context, ".bind");
    }

    /**
     * @method update - Updates the element with the value of the property
     * @param uuid {string} - The uuid of the element
     * @param properties {string[]} - The properties to update
     * @returns {Promise<void>}
     */
    async update(uuid, ...properties) {
        await bindingUpdate(uuid, ...properties);
    }

    /**
     * @method clear - Clears the element from the store
     * @param uuid {string} - The uuid of the element
     * @returns {Promise<void>}
     */
    async clear(uuid) {
        crs.binding.eventStore.clear(uuid);
    }
}