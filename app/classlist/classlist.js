export default class Classlist extends crs.classes.ViewBase {
    async preLoad() {
        this.setProperty("background", "red");
    }
}