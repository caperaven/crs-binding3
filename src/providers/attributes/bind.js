import "../../expressions/code-factories/if.js";

export default class BindProvider {
    #store = {};
    #onEventHandler = this.#onEvent.bind(this);

    constructor() {
        document.addEventListener("change", this.#onEventHandler);
    }

    get store() {
        return this.#store;
    }

    async parse(attr, context) {
        const parts = attr.name.split(".");
        const element = attr.ownerElement;
        const property = parts[0];
        const path = attr.value;

        crs.binding.utils.markElement(element, context.bid);
        element.removeAttribute(attr.name);
        element.setAttribute("data-field", path);

        const eventObj = this.#store[element["__uuid"]] ||= {};
        eventObj[path] = property;

        crs.binding.data.setCallback(element["__uuid"], context.bid, [path]);
    }

    async update(uuid, ...properties) {
        const element = crs.binding.elements[uuid];
        if (element == null) return;

        const bid = element["__bid"];

        for (const property of properties) {
            const targetProperty = this.store[uuid]?.[property];
            if (targetProperty == null) continue;

            element[targetProperty] = await crs.binding.data.getProperty(bid, property) || "";
        }
    }

    async #onEvent(event) {
        const bid = event.target["__bid"];
        const field = event.target.dataset.field;

        if (bid == null || field == null) return;

        await crs.binding.data.setProperty(bid, field, event.target.value);
    }
}