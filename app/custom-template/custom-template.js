export default class CustomTemplateViewModel extends crs.classes.ViewBase {
    #customTemplateFun(element) {
        const newElement = document.createElement("div");
        newElement.innerHTML = "This is a custom template";
        element.parentElement.replaceChild(newElement, element);
    }

    preLoad() {
        crs.binding.templateProviders.add("test", this.#customTemplateFun);
    }

    disconnectedCallback() {
        crs.binding.templateProviders.remove("test");
        super.disconnectedCallback();
    }
}