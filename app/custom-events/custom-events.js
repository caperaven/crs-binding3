import "./input-mimic/input-mimic.js";
import "./custom-event/custom-event.js";
import "./capitalized-property/capitalized-property.js";

export default class CustomEventsViewModel extends crs.classes.ViewBase {
    preLoad() {
        this.setProperty("customValue", "Custom Events Value 1");
        this.setProperty("customValue2", "Custom Events Value 2");
    }
}