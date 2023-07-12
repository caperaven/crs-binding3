import "./timing-component.js";

export default class BindingTimingExample extends crs.classes.ViewBase {
    preLoad() {
        const instance = document.querySelector("timing-component");
        instance.something = "something 1";
    }

    load() {
        const instance = document.querySelector("timing-component");
        instance.something = "something 2";
        super.load();
    }


    async addComponent() {
        const timingComponent = document.createElement("timing-component");
        timingComponent.something = "Hello World";
        this.element.appendChild(timingComponent);
        timingComponent.something = "Hello World 2";


        setTimeout(() => {
            const component = document.querySelector("timing-component");
            component.something = "Hello World 3";
        }, 2500)
    }
}