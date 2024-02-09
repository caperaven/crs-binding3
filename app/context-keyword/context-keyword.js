export default class ContextKeyword extends crs.classes.ViewBase {
    setIsDialog(value) {
        this.setProperty("context.isDialog", value === "true");
        this.setProperty("isDialog", value === "true");
    }
}