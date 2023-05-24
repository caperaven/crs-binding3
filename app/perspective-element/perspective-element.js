import "./../../src/classes/perspective-element.js";

export default class PerspectiveElementViewModel extends crs.classes.ViewBase {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async preLoad() {
        this.setProperty("view", "view1");
    }

    async load() {
        requestAnimationFrame(() => {
            console.log(this.perspectiveContainer);
            super.load();
        });
    }

    async viewLoaded(event) {
        console.log("view loaded", event);
    }
}