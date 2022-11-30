/**
 * This is the main management of the binding data.
 * This includes context data.
 */

export class BindingData {
    #nextId = 0;
    #context = {};
    #data = {};
    #callbacks = {};

    #getNextId() {
        const result = this.#nextId;
        this.#nextId += 1;
        return result;
    }

    #getContextId(id) {
        if (typeof id == "object") {
            return id.bid;
        }
        return id;
    }

    async #performUpdate(bid, property) {
        const uuid = this.#callbacks[bid]?.[property];

        if (uuid != null) {
            await crs.binding.providers.update(uuid, property)
        }
    }

    setCallback(uuid, bid, properties) {
        const obj = this.#callbacks[bid] ||= {};

        for (const property of properties) {
            obj[property] = uuid;
            this.#performUpdate(bid, property).catch(e => console.error(e));
        }
    }

    /**
     * Create a binding context data object.
     * This is the starting point for all bindable context objects
     * @param name {string} debug name to use
     * @param struct {any} object structure to use, leave empty to default to standard empty object literal
     * @returns {number} the new context id to use as reference
     */
    addObject(name, struct = {}) {
        const id = this.#getNextId();
        this.#data[id] = {
            name: name,
            type: "data",
            data: struct
        };
        this.#callbacks[id] = {};

        return id;
    }

    /**
     * add a binding context for the binding id
     */
    addContext(id, obj) {
        this.#context[id] = obj;
    }

    /**
     * Get the context object
     */
    getContext(id) {
        return this.#context[id];
    }

    /**
     * Get the binding data object for the id provided
     */
    getData(id) {
        id = this.#getContextId(id);
        return this.#data[id];
    }

    getDataForElement(element) {
        const bid = element?.["__bid"];
        if (bid == null) return;

        const data = crs.binding.data.getData(bid);
        return data.data;
    }

    /**
     * Remove the data and context objects and do cleanup
     */
    remove(id) {
        id = this.#getContextId(id);
        crs.binding.utils.disposeProperties(this.#data[id]);
        crs.binding.utils.disposeProperties(this.#context[id]);

        delete this.#data[id];
        delete this.#context[id];
    }

    /**
     * Set a property for a given binding context on a provided path
     */
    getProperty(id, property) {
        return crs.binding.utils.getValueOnPath(this.getData(id)?.data, property);
    }

    /**
     * Get a property for a given binding context on a provided path
     */
    setProperty(id, property, value) {
        crs.binding.utils.setValueOnPath(this.getData(id)?.data, property, value);
        this.#performUpdate(id, property);
    }
}