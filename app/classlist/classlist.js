export default class ClasslistViewModel extends crs.classes.ViewBase {
    async preLoad() {
        this.setProperty("background", "red");
    }
}