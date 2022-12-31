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
        if (this.#callbacks[bid] == null) return;

        const uuids = this.#callbacks[bid]?.[property];

        // item found on full path
        if (uuids != null) {
            for (const uuid of uuids.values()) {
                await crs.binding.providers.update(uuid, property);
            }

            return;
        }

        // scan paths
        for (const dataProperty of Object.keys(this.#callbacks[bid])) {
            if (dataProperty.indexOf(property) == 0) {
                await this.#performUpdate(bid, dataProperty);
            }
        }
    }

    setCallback(uuid, bid, properties) {
        const obj = this.#callbacks[bid] ||= {};

        for (const property of properties) {
            if (obj[property] == null) {
                obj[property] = new Set();
            }

            obj[property].add(uuid);
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

    getCallbacks(id, property) {
        const set = this.#callbacks[id]?.[property];
        return set == null ? [] : Array.from(set);
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
        id = this.#getContextId(id);
        return crs.binding.utils.getValueOnPath(this.getData(id)?.data, property);
    }

    /**
     * Get a property for a given binding context on a provided path
     */
    async setProperty(id, property, value) {
        id = this.#getContextId(id);

        if (Array.isArray(value)) {
            value.__bid = id;
            value.__property = property;
            value = (await import("./../proxies/array-proxy.js")).default(value)
        }

        crs.binding.utils.setValueOnPath(this.getData(id)?.data, property, value);
        await this.#performUpdate(id, property);
    }

    setName(id, name) {
        id = this.#getContextId(id);
        const data = crs.binding.data.getData(id);
        data.name = name;
    }

    /**
     * Update this element so that the bindings are applied
     */
    async updateElement(element) {
        const bid = element["__bid"];
        const uuid = element["__uuid"];
        if (bid == null || uuid == null) return;

        for (const property of Object.keys(this.#callbacks[bid])) {
            await crs.binding.providers.update(uuid, property);
        }
    }
}