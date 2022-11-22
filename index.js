export class IndexViewModel {
    #bid;

    get bid() {
        return this.#bid;
    }

    constructor() {
        this.#bid = crs.binding.data.addObject("indexViewModel");
        crs.binding.data.addContext(this.#bid, this);
    }

    log(...args) {
        console.log(...args);
    }

    async clear(index) {
        await crs.binding.providers.clear([document.body.children[index]]);
    }
}