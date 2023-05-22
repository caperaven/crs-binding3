export default class CustomTemplateViewModel extends crs.classes.ViewBase {
    #customTemplate(element) {
        const newElement = document.createElement("div");
        newElement.innerText = "This is a custom template";
        element.parentElement.replaceChild(newElement, element);
    }

    preLoad() {
        crs.binding.templateProviders.add("test", this.#customTemplate);
    }

    disconnectedCallback() {
        crs.binding.templateProviders.remove("test");
        super.disconnectedCallback();
    }
}