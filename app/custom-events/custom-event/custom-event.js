class CustomEventComponent extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get useShadow() {
        return true;
    }

    async click(event) {
        this.myvalue = "My custom event value";
        this.dispatchEvent(new CustomEvent("change", { detail : { componentProperty : "myvalue" }}));
    }
}

customElements.define("custom-event", CustomEventComponent);