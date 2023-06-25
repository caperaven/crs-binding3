import "./custom-component.js";

export default class CustomEventsViewModel extends crs.classes.ViewBase {
    preLoad() {
        this.setProperty("customValue", "Custom Events Value 1");
    }
}