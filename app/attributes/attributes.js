export default class AttributesViewModel extends crs.classes.ViewBase {
    get mobi() {
        return import.meta.url.replace(".js", ".mobi.html");
    }

    async preLoad() {
        this.setProperty("age", 10);
    }
}