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
        return this.#data[id];
    }

    getProperty(id, property) {
        id = this.#getContextId(id);
        return crs.binding.utils.getValueOnPath(this.#data[id], property);
    }

    setProperty(id, property, value) {
        id = this.#getContextId(id);
        crs.binding.utils.setValueOnPath(this.#data[id], property, value);
    }
}