import {OptionalChainActions} from "../../utils/optional-chain-actions.js";

export class AttrBase {
    #store = {};

    get store() { return this.#store; }

    /**
     * @method parse - Parses the attribute and adds it to the store.
     * @param attr {Attribute} - The attribute to parse.
     * @param context {Context} - The context of the attribute.
     * @param callback {Function} - The callback to parse the attribute.
     * @returns {Promise<void>}
     */
    async parse(attr, context, callback) {
        const parts = attr.name.split(".");
        const element = attr.ownerElement;
        element.removeAttribute(attr.name);

        const attrName = parts[0];
        crs.binding.utils.markElement(element, context);

        const expo = await callback(attr.value);

        const obj = this.#store[element["__uuid"]] ||= {};
        obj[attrName] = expo.key;

        crs.binding.data.setCallback(element["__uuid"], context.bid, expo.parameters.properties, this.providerKey);
    }

    /**
     * @method update - Updates the store for the given uuid.
     * @param uuid {string} - The uuid of the element.
     * @param properties {string[]} - The properties to update.
     * @returns {Promise<void>} - The promise to update the store.
     */
    async update(uuid, ...properties) {
        if (this.#store[uuid] == null) return;

        const element = crs.binding.elements[uuid];
        const data = crs.binding.data.getDataForElement(element);

        for (const [attrName, fnKey] of Object.entries(this.#store[uuid])) {
            const expo = crs.binding.functions.get(fnKey);
            const result = await expo.function(data);
            const useValue = OptionalChainActions.hasTernary(fnKey);

            if (useValue === false) {
                if (result === false) {
                    element.removeAttribute(attrName);
                    continue;
                }

                element.setAttribute(attrName, attrName);
                continue;
            }

            if (result != null) {
                element.setAttribute(attrName, result);
            }
            else {
                element.removeAttribute(attrName);
            }
        }
    }

    /**
     * @method clear - Clears the store for the given uuid.
     * @param uuid {string} - The uuid of the element.
     * @returns {Promise<void>}
     */
    async clear(uuid) {
        const obj = this.#store[uuid];
        if (obj == null) return;

        delete this.#store[uuid];
    }
}