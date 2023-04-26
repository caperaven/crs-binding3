import "./../../src/classes/crs-widget.js";

export default class CrsWidgetViewModel extends crs.classes.ViewBase {
    async preLoad() {
        this.setProperty("name", "John");
    }

    async load() {
        await super.load();

        const url = new URL("./widget.html", import.meta.url);
        const context = this.bid;

        await this.widget.onMessage({ context, url });
    }
}