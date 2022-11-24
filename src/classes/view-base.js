export class ViewBase {
    #element;
    #bid

    get title() {
        return this.getProperty("title");
    }

    set title(newValue) {
        this.setProperty("title", newValue);
    }

    get element() {
        return this.#element;
    }

    constructor(element) {
        this.#bid = crs.binding.data.addObject(this.constructor.name);
        crs.binding.data.addContext(this.#bid, this);
        this.#element = element;
        this.#element.dataset.ready = "false";
    }

    async connectedCallback() {
        if(this["preLoad"] != null) {
            await this["preLoad"]();
        }

        const path = crs.binding.utils.getPathOfFile(this.html);

        await crs.binding.parsers.parseElement(this.element, this.#bid, path ? {folder: path} : null);
        await this.load();
    }

    async disconnectedCallback() {
        await crs.binding.data.remove(this.#bid);
        this.#element = null;
    }

    getProperty(property, convert = true) {
        return crs.binding.data.getProperty(this, property, convert);
    }

    setProperty(property, value, convert = true) {
        crs.binding.data.setProperty(this, property, value, convert);
    }

    async load() {
        this.#element.style.visibility = "";
        this.#element.dataset.ready = "true";
    }
}