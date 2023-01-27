/**
 * @class TemplateInflationStore - This is a store used for inflation of templates.
 * This is used internally to store templates and functions to be called when a template is inflated.
 */
export class TemplateInflationStore {
    #store = {};

    /**
     * @method add - Add a template to the store with a function to be called when the template is inflated.
     * @param name {string} - The name of the template
     * @param template {string} - The template to be stored
     * @param fn {function} - The function to be called when the template is inflated
     */
    add(name, template, fn) {
        this.#store[name] = {
            template, fn
        }
    }

    /**
     * @method get - Get a template from the store by name and return the template and function to be called when the template is inflated.
     * @param name {string} - The name of the template
     * @returns {*}
     */
    get(name) {
        return this.#store[name];
    }

    /**
     * @method remove - Remove a template from the store by name
     * @param name {string} - The name of the template
     */
    remove(name) {
        const item = this.#store[name];
        delete this.#store[name];

        item.template = null;
        item.fn = null;
    }
}