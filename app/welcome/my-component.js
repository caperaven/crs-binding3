import "./../../src/classes/bindable-element.js"

export class MyComponent extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async preLoad() {
        this.setProperty("title", "My Component");
    }
}

customElements.define("my-component", MyComponent);
