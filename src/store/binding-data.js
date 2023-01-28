/**
 * @class BindingData - This is the main management of the binding data.
 * This includes context data.
 * This is a singleton class.
 *
 * @property #nextId {number} - The next id to use for a context
 * @property #context {object} - This provides access to the binding context / view model to call functions on it
 * @property #data {object} - The data is stored here for the binding context
 * @property #callbacks {object} - The callbacks are stored here for the binding context, when a property changes this determines what gets updated.
 * @property #elementProviders {object} - The providers are stored here for the binding context, when a property changes this determines what gets updated.
 *
 * #callbacks is grouped as follows:
 * 1. The context id
 * 2. The property name
 * 3. The uuid of elements to update
 * When a property changes on a context, this makes it easy to lookup what elements need to be updated.
 *
 * The context has a property "boundElements" which is an array of elements that are bound to the context.
 * This makes it easier to update only those elements associated with the context.
 * It also makes cleanup of the context easier since you know what elements to clean up.
 * You can look up those elements in the #elementProviders object and see what providers are associated with the element.
 * This way you can target what providers need to be called for an update.
 */
export class BindingData {
    #nextId = 1;
    #context = {};
    #data = {
        0: {
            name: "global",
            type: "data",
            data: {}
        }
    };
    #callbacks = {};
    #elementProviders = {};

    /**
     * @property #getNextId - Get the next id to use for a context
     * @returns {number}
     */
    #getNextId() {
        const result = this.#nextId;
        this.#nextId += 1;
        return result;
    }

    /**
     * @property #getContextId - Get the context id from the id provided
     * @param id
     * @returns {*|number|number}
     */
    #getContextId(id) {
        if (typeof id == "object") {
            return id.bid;
        }
        return id;
    }

    /**
     * @property globals - Get the global data object. Used in compiled functions to access globals data.
     * @returns {*}
     */
    get globals() {
        return this.#data[0].data;
    }

    /**
     * @method #performUpdate - Perform an update on the given context and property
     * @param bid {number} - The binding id to use
     * @param property {string} - The property to update
     * @returns {Promise<void>}
     */
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

    /**
     * @method setCallback - Set the callback for the given property.
     * This is used to determine what to update when a property changes.
     *
     * @param uuid {string} - The uuid of the element
     * @param bid {number} - The binding id to use
     * @param properties {string[]} - The properties to set the callback for
     */
    setCallback(uuid, bid, properties, provider) {
        const obj = this.#callbacks[bid] ||= {};

        for (const property of properties) {
            if (property.indexOf(GLOBALS) !== -1) {
                this.setCallback(uuid, 0, [property.replace(GLOBALS, "")], provider);
                continue;
            }

            if (obj[property] == null) {
                obj[property] = new Set();
            }

            obj[property].add(uuid);

            this.#elementProviders[uuid] ||= new Set();
            this.#elementProviders[uuid].add(provider);
        }
    }

    /**
     * @method addObject - Create a binding context data object.
     * This is the starting point for all bindable context objects
     *
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
     * @method addContext - Add a binding context to the binding data
     * @param id {number} - The id to use for the context. This is the same as the binding id
     * @param obj {object} - The context object
     */
    addContext(id, obj) {
        this.#context[id] = obj;
    }

    /**
     * @method getContext - Get the context object for the id provided
     * @param id {number} - The id to use for the context. This is the same as the binding id
     */
    getContext(id) {
        return this.#context[id];
    }

    /**
     * @method getData - Get the data object for the id provided (this is the binding context)
     * @param id {number} - The id to use for the context. This is the same as the binding id
     */
    getData(id) {
        id = this.#getContextId(id);
        return this.#data[id];
    }

    /**
     * @method getCallback - Get the callback for the given property and id provided
     * @param id {number} - The id to use for the context. This is the same as the binding id
     * @param property {string} - The property to get the callback for
     * @returns {*[]|unknown[]}
     */
    getCallbacks(id, property) {
        const set = this.#callbacks[id]?.[property];
        return set == null ? [] : Array.from(set);
    }

    /**
     * @method getDataForElement - Get the data object for the element provided.
     * It will read the __bid property on the element to get the id to use.
     * @param element {HTMLElement} - The element to get the data for
     * @returns {*}
     */
    getDataForElement(element) {
        const bid = element?.["__bid"];
        if (bid == null) return;

        const data = crs.binding.data.getData(bid);
        return data.data;
    }

    /**
     * @method remove - Remove the data and context objects and do cleanup for the id provided
     * @param id {number} - The id to use for the context. This is the same as the binding id
     */
    remove(id) {
        id = this.#getContextId(id);

        const context = this.#context[id];
        for (const uuid of context.boundElements) {
            delete this.#elementProviders[uuid];
        }
        delete context.boundElements;

        crs.binding.utils.disposeProperties(this.#data[id]);
        crs.binding.utils.disposeProperties(this.#context[id]);

        delete this.#data[id];
        delete this.#context[id];
    }

    /**
     * @method getProperty - Get a property for a given binding context on a provided path (supports global properties)
     * @param id {number} - The id to use for the context. This is the same as the binding id
     * @param property {string} - The property to get the value for
     */
    getProperty(id, property) {
        if (property.indexOf(GLOBALS) !== -1) {
            id = 0;
            property = property.replace(GLOBALS, "");
        }

        id = this.#getContextId(id);
        return crs.binding.utils.getValueOnPath(this.getData(id)?.data, property);
    }

    /**
     * @method setProperty - Set a property for a given binding context on a provided path (supports global properties)
     * @param id {number} - The id to use for the context. This is the same as the binding id
     * @param property {string} - The property to set the value for
     * @param value {any} - The value to set
     */
    async setProperty(id, property, value) {
        let setProperty = property;

        if (setProperty.indexOf(GLOBALS) !== -1) {
            id = 0;
            setProperty = property.replace(GLOBALS, "");
        }

        id = this.#getContextId(id);

        if (Array.isArray(value)) {
            value.__bid = id;
            value.__property = setProperty;
            value = (await import("./../proxies/array-proxy.js")).default(value)
        }

        crs.binding.utils.setValueOnPath(this.getData(id)?.data, setProperty, value);
        await this.#performUpdate(id, setProperty);
    }

    /**
     * @method setName - Set the name for the binding context to help with debugging
     * @param id {number} - The id to use for the context. This is the same as the binding id
     * @param name {string} - The name to set
     */
    setName(id, name) {
        id = this.#getContextId(id);
        const data = crs.binding.data.getData(id);
        data.name = name;
    }

    /**
     * @method updateElement - Update the element provided with the binding context data
     * @param element {HTMLElement} - The element to update
     */
    async updateElement(element) {
        const bid = element["__bid"];
        const uuid = element["__uuid"];
        if (bid == null || uuid == null) return;

        for (const property of Object.keys(this.#callbacks[bid])) {
            await crs.binding.providers.update(uuid, property);
        }
    }

    /**
     * @method updateContext - Update all the elements bound to the context.
     * @param bid {number} - The id to use for the context. This is the same as the binding id
     * @returns {Promise<void>}
     */
    async updateContext(bid) {
        const context = this.getContext(bid);
        if (context == null || context.boundElements == null) return;

        for (const uuid of context.boundElements) {
            // call providers don't need to be updated but, they still marked with a uuid
            const providers = this.#elementProviders[uuid];
            if (providers == null) continue;

            const providersCollection = Array.from(providers);
            await crs.binding.providers.updateProviders(uuid, ...providersCollection);
        }
    }
}