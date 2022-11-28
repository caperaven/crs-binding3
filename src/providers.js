export class Providers {
    #attrProviders = {};
    #elementProviders = {};
    #textProviders = [];
    #attrPartialKeys = [];
    #elementQueries = [];

    get textProviders() {
        return this.#textProviders;
    }

    constructor(attrProviders, elementProviders) {
        for (const key of Object.keys(attrProviders)) {
            this.addAttributeProvider(key, attrProviders[key]);
        }

        for (const key of Object.keys(elementProviders)) {
            this.addElementProvider(key, elementProviders[key]);
        }
    }

    dispose() {
        this.#attrProviders = null;
        this.#attrPartialKeys.length = 0;
    }

    async #loadModule(file) {
        file = file.replace("$root", crs.binding.root);
        return new (await import(file)).default();
    }

    async #getAttrModule(key) {
        const module = this.#attrProviders[key];
        if (typeof module !== "string") return module;

        this.#attrProviders[key] = await this.#loadModule(module);
        return this.#attrProviders[key];
    }

    /**
     * Add a provider that can be used during parsing processes.
     */
    addAttributeProvider(key, file) {
        this.#attrProviders[key] = file;

        if (key.indexOf(".") != -1) {
            this.#attrPartialKeys.push(key);
        }
    }

    /**
     * Add a provider that can be used during element parsing
     * The key must be a query string used to match the element with the provider
     */
    addElementProvider(key, file) {
        this.#elementProviders[key] = file;
        this.#elementQueries.push(key);
    }

    /**
     * Add providers that will evaluate text.
     * @param file
     */
    async addTextProvider(file) {
        this.#textProviders.push(await this.#loadModule(file));
    }

    /**
     * Get provider registered as attribute provider based on attribute name
     * @param attrName
     * @returns {Promise<*>}
     */
    async getAttrProvider(attrName) {
        if (this.#attrProviders[attrName] != null) return await this.#getAttrModule(attrName);

        for (const key of this.#attrPartialKeys) {
            if (attrName.indexOf(key) != -1) {
                return await this.#getAttrModule(key);
            }
        }
    }

    /**
     * Get the provider for this element
     * @param element
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

    async getTextProviders() {
        return this.#textProviders;
    }

    /**
     * Clear the providers for the element being released based on it's uuid
     */
    async clear(elements) {
        const providers = Object.keys(this.#attrProviders);

        for (const element of elements) {
            if (element["__uuid"] == null) continue;

            for (const provider of providers) {
                this.#attrProviders[provider].clear(element)
            }

            delete element["__uuid"];
            delete element["__bid"];
        }
    }
}

