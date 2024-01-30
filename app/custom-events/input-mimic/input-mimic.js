class InputMimic extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get useShadow() {
        return true;
    }

    async click(event) {
        this.value = "Custom Events Value 2";
        this.dispatchEvent(new CustomEvent("change"));
    }
}

customElements.define("input-mimic", InputMimic);