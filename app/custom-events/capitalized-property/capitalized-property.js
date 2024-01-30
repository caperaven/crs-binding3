class CapitalizedProperty extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get useShadow() {
        return true;
    }

    async click(event) {
        this.captalizedValue = "My Capitalized Value";
        this.dispatchEvent(new CustomEvent("change", { detail : { componentProperty : "captalizedValue" }}));
    }
}

customElements.define("capitalized-property", CapitalizedProperty);