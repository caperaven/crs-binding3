class MyComponent extends HTMLElement {
    onMessage(event) {
        console.log(event);
    }
}

customElements.define("my-component", MyComponent);
