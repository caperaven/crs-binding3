import "./../../src/classes/bindable-element.js"

export class MyComponent extends crs.classes.BindableElement {

    set value(newValue) {
        console.log("one way binding: ", newValue);
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async preLoad() {
        this.setProperty("title", "My Component");
    }
}

customElements.define("my-component", MyComponent);
