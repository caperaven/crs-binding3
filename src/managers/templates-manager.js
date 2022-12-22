export class TemplatesManager {
    #store = {};

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

function getTemplateText(template) {
    const copy = template.content.cloneNode(true);
    return copy.innerHTML || copy.textContent;
}