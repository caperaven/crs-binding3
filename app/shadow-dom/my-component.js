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
    }

    async reset() {
        this.setProperty("firstName", "Reset First Name");
        this.setProperty("lastName", "Reset Last Name");
        this.setProperty("age", 20);
    }
}

customElements.define("my-component-2", MyComponent);
