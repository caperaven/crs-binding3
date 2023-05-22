/**
 * This is a special class used to register templates that gets managed by the inflation manager during the parsing of elements.
 * When it finds an element of type "template", it checks here if there are any special template providers registered for that type.
 * If so it will call the function and pass the element as a parameter.
 */
export class TemplateProviderStore {
    #keys = [];
    #items = {};

    add(key, fn) {
        this.#keys.push(key);
        this.#items[key] = fn;
    }

    remove(key) {
        this.#keys.splice(this.#keys.indexOf(key), 1);
        delete this.#items[key];
    }

    async executeTemplateAction(element, context) {
        if (element.attributes.length === 0) return;

        for (const key of this.#keys) {
            if (element.getAttribute(key) != null) {
                const fn = this.#items[key];
                await fn(element, context);
            }
        }
    }
}