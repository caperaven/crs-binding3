export default class Welcome extends crs.classes.ViewBase {
    get mobi() {
        return import.meta.url.replace(".js", ".mobi.html");
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async preLoad() {
        this.setProperty("person", {
            firstName: "John",
            lastName: "Doe",
            age: 30
        })
    }
}