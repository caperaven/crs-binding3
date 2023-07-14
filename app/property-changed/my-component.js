class MyComponent extends HTMLElement {
    log(...args) {
        console.log(...args);
    }
}

customElements.define('my-component', MyComponent);