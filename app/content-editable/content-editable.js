export default class ContentEditable extends crs.classes.ViewBase {
    preLoad() {
        this.setProperty("firstName", "John");
        this.setProperty("lastName", "Doe");
    }
}