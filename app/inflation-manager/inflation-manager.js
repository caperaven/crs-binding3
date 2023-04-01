import "./../../src/managers/inflation-manager.js";

export default class InflationManagerViewModel extends crs.classes.ViewBase {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async load() {
        console.log(this.tpl, this.collection);
    }
}