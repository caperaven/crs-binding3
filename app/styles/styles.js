export default class StylesViewModel extends crs.classes.ViewBase {
    async preLoad() {
        this.setProperty("background", "red");
    }
}