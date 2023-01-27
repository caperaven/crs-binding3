/**
 * @class TemplatesManager
 * @description This class is used to manage templates.
 * Templates are loaded from a path and cached.
 * The html is then converted to a template and stored.
 * It will cache templates and only load them once.
 * It will also remove templates when they are no longer needed.
 *
 * A counter is maintained for each template. When a template is requested the counter is incremented.
 * When a template is no longer needed the counter is decremented.
 * When the counter reaches 0 the template is removed from the store.
 *
 * It s important to remove the template when it is no longer needed.
 */
export class TemplatesManager {
    #store = {};

    /**
     * Get a template from the store.
     * If it doesn't exist then load it from the path and add it to the store and return it.
     * The result is the innerHTML or textContent of the template.
     * @param name {string} - The name of the template.
     * @param path {string} - The path to the template using a absolute path.
     * @returns {Promise<string>}
     */
    get(name, path) {
        return new Promise(async resolve => {
            this.#store[name] ||= {
                count: 0,
                queue: [],
                loading: false,
                template: null
            }

            this.#store[name].count += 1;

            if (this.#store[name].template == null && this.#store[name].loading === false) {
                this.#store[name].loading = true;

                const html = await fetch(path).then(result => result.text());
                const template = document.createElement("template");
                template.innerHTML = html;

                this.#store[name].template = template;

                for (const callback of this.#store[name].queue) {
                    callback();
                }

                delete this.#store[name].loading;
                delete this.#store[name].queue;
                resolve(getTemplateText(this.#store[name].template));
            }

            if (this.#store[name].template == null) {
                this.#store[name].queue.push(() => {
                    resolve(getTemplateText(this.#store[name].template));
                })
            }
            else {
                resolve(getTemplateText(this.#store[name].template));
            }
        })
    }

    /**
     * Remove a template from the store.
     * The counter is decremented.
     * When the counter reaches 0 the template is removed from the store.
     * @param name {string} - The name of the template that was defined during the get call
     * @returns {Promise<void>}
     */
    async remove(name) {
        if (this.#store[name] == null) return;

        this.#store[name].count -= 1;

        if (this.#store[name].count === 0) {
            this.#store[name].count = null;
            this.#store[name].template = null;
            delete this.#store[name];
        }
    }
}

/**
 * Get the innerHTML or textContent of a template.
 * @param template {HTMLTemplateElement} - The template to get the text from.
 * @returns {string}
 */
function getTemplateText(template) {
    const copy = template.content.cloneNode(true);
    return copy.innerHTML || copy.textContent;
}