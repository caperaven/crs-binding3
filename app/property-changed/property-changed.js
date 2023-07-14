import "./my-component.js";

export default class PropertyChangedViewModel extends crs.classes.ViewBase {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }
}