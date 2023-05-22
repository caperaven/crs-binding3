import "../../src/managers/static-inflation-manager.js";

export default class StaticInflationViewModel extends crs.classes.ViewBase {

    preLoad() {
        this.data = {
            person: {
                firstName: "John",
                lastName: "Doe",
                age: 40,
            }
        };
    }

    async build() {
        const template = this.element.querySelector("template");
        const instance = template.content.cloneNode(true);
        this.container.appendChild(instance);

        await crs.binding.staticInflationManager.inflateElement(this.container, this.data);
    }
}