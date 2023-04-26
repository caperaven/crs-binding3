/**
 * @class Providers - A class that holds all providers used by the binding engine.
 * When working with providers you do so through this class.
 * This is for internal use only.
 *
 * @property textProviders - A list of text providers.
 * @property elementProviders - A list of element providers.
 * @property attrPartialKeys - A list of attribute queries that are partial keys.
 * @property attrProviders - A list of attribute providers, either a string or a instance of the provider.
 * @property elementQueries - A list of element queries.
 */
export class Providers {
    #regex = {};
    #attrProviders = {};
    #elementProviders = {};
    #textProviders = [];
    #attrPartialKeys = [];
    #elementQueries = [];

    /**
     * @property textProviders - A list of text providers.
     * @returns {*[]}
     */
    get textProviders() {
        return this.#textProviders;
    }

    /**
     * @property elementProviders - A list of element providers.
     * @returns {{}}
     */
    get elementProviders() {
        return this.#elementProviders;
    }

    /**
     * @constructor
     * @param attrProviders - A list of attribute providers.
     * @param elementProviders - A list of element providers.
     */
    constructor(attrProviders, elementProviders) {
        for (const key of Object.keys(attrProviders)) {
            this.addAttributeProvider(key, attrProviders[key]);
        }

        for (const key of Object.keys(elementProviders)) {
            this.addElementProvider(key, elementProviders[key]);
        }
    }

    /**
     * @function #loadModule - Load the code from file and return the default export.
     * @param file {string} - The file to load.
     * @returns {Promise<Object>} - The default export.
     */
    async #loadModule(file) {
        file = file.replace("$root", crs.binding.root);
        return new (await import(file)).default();
    }

    /**
     * @function #getAttrModule - Get the attribute provider.
     * @param key {string} - The attribute name.
     * @returns {Promise<*>} - The attribute provider.
     */
    async #getAttrModule(key) {
        const module = this.#attrProviders[key];
        if (typeof module !== "string") return module;

        this.#attrProviders[key] = await this.#loadModule(module);
        return this.#attrProviders[key];
    }

    /**
     * @function addAttributeProvider - Add a provider that can be used during parsing processes.
     */
    addAttributeProvider(key, file) {
        this.#attrProviders[key] = file;

        if (key.indexOf(".") != -1) {
            this.#attrPartialKeys.push(key);
        }
    }

    /**
     * @function addElementProvider - Add a provider that can be used during element parsing
     * The key must be a query string used to match the element with the provider
     *
     * @param key {string} - The query string to match the element with the provider.
     * @param file {string} - The file to load the provider from.
     */
    addElementProvider(key, file) {
        this.#elementProviders[key] = file;
        this.#elementQueries.push(key);
    }

    /**
     * @function addTextProvider - Add providers that will evaluate text.
     * @param file {string} - The file to load the provider from.
     */
    async addTextProvider(file) {
        this.#textProviders.push(await this.#loadModule(file));
    }

    /**
     * @function getAttrProvider - Get provider registered as attribute provider based on attribute name
     * @param attrName {string} - The attribute name to get the provider for.
     * @returns {Promise<*>}
     */
    async getAttrProvider(attrName) {
        if (attrName === "ref") return await this.#getAttrModule("ref");

        if (attrName.indexOf(".") == -1) return null;
        if (this.#attrProviders[attrName] != null) return await this.#getAttrModule(attrName);

        for (const key of this.#attrPartialKeys) {
            // key is a regex so test it as a regex
            if (key[0] === "^") {
                let regex = this.#regex[key];

                if (regex == null) {
                    regex = new RegExp(key);
                    this.#regex[key] = regex;
                }

                if (regex.test(attrName)) {
                    return await this.#getAttrModule(key);
                }
            }

            // key is a partial string so use index
            if (attrName.indexOf(key) != -1) {
                return await this.#getAttrModule(key);
            }
        }
    }

    /**
     * @function getElementProvider - Get provider registered as element provider based on element
     * @param element {Element} - The element to get the provider for.
     * @returns {Promise<void>}
     */
    async getElementProvider(element) {
        for (const query of this.#elementQueries) {
            if (element.matches(query)) {
                if (typeof this.#elementProviders[query] === "object") {
                    return this.#elementProviders[query];
                }

                this.#elementProviders[query] = await this.#loadModule(this.#elementProviders[query]);
                return this.#elementProviders[query];
            }
        }
    }

    /**
     * @function getTextProviders - Get all text providers
     * @returns {Promise<*[]>}
     */
    async getTextProviders() {
        return this.#textProviders;
    }

    /**
     * @function update - Update the UI based on the uuid and properties
     * @param uuid {string} - The uuid of the element to update.
     * @param properties {string[]} - The properties to update.
     * @returns {Promise<void>}
     */
    async update(uuid, ...properties) {
        for (const textProvider of this.#textProviders) {
            if (textProvider.store[uuid] != null) {
                textProvider.update(uuid);
            }
        }

        for (const key of this.#attrPartialKeys) {
            const provider = this.#attrProviders[key];

            if (typeof provider === "string") continue;

            if (provider.store?.[uuid] != null) {
                provider.update?.(uuid, ...properties);
            }
        }
    }

    async updateProviders(uuid, ...providerKeys) {
        for (const providerKey of providerKeys) {
            let provider;

            if (providerKey === ".textContent") {
                provider = this.#textProviders[0];
            }
            else {
                provider =
                    this.#attrProviders[providerKey] ||
                    this.#elementProviders[providerKey];
            }

            provider.update(uuid);
        }
    }

    /**
     * @function clear - Clear the providers for the element being released based on it's uuid
     * @param uuid {string} - The uuid of the element to clear.
     */
    async clear(uuid) {
        for (const textProvider of this.#textProviders) {
            textProvider.clear(uuid);
        }

        for (const key of this.#attrPartialKeys) {
            this.#attrProviders[key].clear?.(uuid);
        }
    }
}

