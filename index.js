export class IndexViewModel {
    #bid;

    get bid() {
        return this.#bid;
    }

    constructor() {
        this.#bid = crs.binding.data.addObject("indexViewModel");
        crs.binding.data.addContext(this.#bid, this);

        crs.binding.data.setProperty(this.#bid, "person.firstName", "My First Name");
    }

    log(...args) {
        console.log(...args);
    }

    async clear(index) {
        await crs.binding.providers.clear([document.body.children[index]]);
    }

    async addPerson() {
        await crs.binding.data.setProperty(0, "person", {firstName: "Daniel", lastName: "Doe"});
    }
}