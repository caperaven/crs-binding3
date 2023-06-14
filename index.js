import "./src/crs-binding.js";
import "./src/classes/view-base.js";
import "./packages/crs-router/crs-router.js";
import "./index.js";

import "./src/events/event-emitter.js";
import "./packages/crs-process-api/crs-process-api.js";
import "./packages/crs-process-api/action-systems/binding-actions.js";
import "./packages/crs-process-api/action-systems/console-actions.js";

export class IndexViewModel extends crs.classes.ViewBase {
    constructor() {
        super();
        this.element = document.body;
    }

    async preLoad() {
        crs.binding.data.setProperty(0, "menuVisible", true);
        const menu = await fetch("/app/routes.json").then(result => result.json());
        this.setProperty("menu", menu.routes);
    }
}

globalThis.viewModel = new IndexViewModel();
requestAnimationFrame(() => {
    globalThis.viewModel.connectedCallback();
})