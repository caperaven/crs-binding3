export class Providers {
    #attrItems = {};
    #attrPartialKeys = [];

    constructor(attrProviders) {
        for (const key of Object.keys(attrProviders)) {
            this.addAttributeProvider(key, attrProviders[key]);
        }
    }

    dispose() {
        this.#attrItems = null;
        this.#attrPartialKeys.length = 0;
    }

    async #loadModule(file) {
        file = file.replace("$root", crs.binding.root);
        return new (await import(file)).default();
    }

    async #getAttrModule(key) {
        const module = this.#attrItems[key];
        if (typeof module !== "string") return module;

        this.#attrItems[key] = await this.#loadModule(module);
        return this.#attrItems[key];
    }

    /**
     * Add a provider that can be used during parsing processes.
     */
    addAttributeProvider(key, file) {
        this.#attrItems[key] = file;

        if (key.indexOf(".") != -1) {
            this.#attrPartialKeys.push(key);
        }
    }

    /**
     * Get provider registered as attribute provider based on attribute name
     * @param attrName
     * @returns {Promise<*>}
     */
    async getAttrProvider(attrName) {
        if (this.#attrItems[attrName] != null) return await this.#getAttrModule(attrName);

        for (const key of this.#attrPartialKeys) {
            if (attrName.indexOf(key) != -1) {
                return await this.#getAttrModule(key);
            }
        }
    }

    /**
     * Clear the providers for the element being released based on it's uuid
     */
    async clear(elements) {
        const providers = Object.keys(this.#attrItems);

        for (const element of elements) {
            if (element["__uuid"] == null) continue;

            for (const provider of providers) {
                this.#attrItems[provider].clear(element)
            }

            delete element["__uuid"];
            delete element["__bid"];
        }
    }
}

