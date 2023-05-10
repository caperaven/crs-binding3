export default class PostProvider {
    #store = {};
    get store() { return this.#store; }

    async parse(attr, context) {
        console.log("parsing post attribute");
    }

    async update(uuid, ...properties) {

    }

    async clear(uuid) {

    }
}