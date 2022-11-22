export class Providers {
    #items = {};

    constructor(providers) {
        for (const key of Object.keys(providers)) {
            this.add(key, providers[key]);
        }
    }

    dispose() {
        this.#items = null;
    }

    /**
     * Add a provider that can be used during parsing processes.
     */
    add(key, file) {
        this.#items[key] = file;
    }

    /**
     * Get the first provider that matches one of the keys that you pass on
     */
    async get(...keys) {
        let result = null;

        for (const key of keys) {
            if (this.#items[key] == null) continue;
            result = this.#items[key];

            if (typeof result !== "string") return result;

            const file = result.replace("$root", crs.binding.root);
            result = new (await import(file)).default();
            this.#items[key] = result;
            return result;
        }
    }

    /**
     * Clear the providers for the element being released based on it's uuid
     */
    async clear(elements) {
        const providers = Object.keys(this.#items);

        for (const element of elements) {
            if (element.dataset.uuid == null) continue;

            for (const provider of providers) {
                this.#items[provider].clear(element)
            }

            delete element.dataset.uuid;
            delete element.dataset.bid;
        }
    }
}

