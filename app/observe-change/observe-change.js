export default class ObserveChangeViewModel extends crs.classes.ViewBase {
    async preLoad() {
        await crs.binding.data.addCallback(this.bid, "firstName", this.#dataChanged);
    }

    async disconnectedCallback() {
        await crs.binding.data.removeCallback(this.bid, "firstName", this.#dataChanged);
        super.disconnectedCallback();
    }

    #dataChanged() {
        console.log("data changed");
    }
}