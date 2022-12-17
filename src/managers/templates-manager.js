export class TemplatesManager {
    #store = {};

    async get(name, path) {
        if (this.#store[name] == null) {
            const template = document.createElement("template");
            template.innerHTML = await fetch(path).then(result => result.text());
            this.#store[name] = template;
        }

        return this.#store[name].cloneNode(true).innerHTML;
    }
}