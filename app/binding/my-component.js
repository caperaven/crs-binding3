import "./../../src/classes/bindable-element.js"

export class MyComponent extends crs.classes.BindableElement {
    get shadowDom() {
        return true;
    }
    set value(newValue) {
        console.log("one way binding: ", newValue);
    }

    set greeting(newValue) {
        console.log("once binding: ", newValue);
    }

    get something() {
        return this.#something;
    }

    set something(newValue) {
        this.#something = newValue;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async preLoad() {
        this.setProperty("title", "My Component");
    }

    async greet(message) {
        this.setProperty("title", message);
        console.log("greet", message);
    }
}

customElements.define("my-component", MyComponent);
