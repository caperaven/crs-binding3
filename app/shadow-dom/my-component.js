import "./../../src/classes/bindable-element.js"

export class MyComponent extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async preLoad() {
        this.setProperty("title", "My Component");

        this.registerEvent(this, "change", (event) => {
            crs.binding.eventStore.callEvent(event);
        })
    }
}

customElements.define("my-component-2", MyComponent);
