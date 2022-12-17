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
                this.#store[name].template = await fetch(path).then(result => result.text());

                for (const callback of this.#store[name].queue) {
                    callback();
                }

                delete this.#store[name].loading;
                delete this.#store[name].queue;
                resolve(this.#store[name].template.slice(0));
            }

            if (this.#store[name].template == null) {
                this.#store[name].queue.push(() => {
                    resolve(this.#store[name].template.slice(0));
                })
            }
            else {
                resolve(this.#store[name].template.slice(0));
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