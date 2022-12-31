import "./my-component.js";

export default class Welcome extends crs.classes.ViewBase {
    get mobi() {
        return import.meta.url.replace(".js", ".mobi.html");
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async preLoad() {
        this.setProperty("person", {
            firstName: "John",
            lastName: "Doe",
            age: 30
        })

        this.setProperty("people", [
            {
                firstName: "John",
                lastName: "Doe",
            },
            {
                firstName: "Jane",
                lastName: "Smith",
            }
        ])
    }

    async reset() {
        this.setProperty("person", {
            firstName: "John",
            lastName: "Doe",
            age: 30
        })
    }

    async add() {
        const array = this.getProperty("people");
        array.push({
            firstName: "Andrew",
            lastName: "Smith",
            age: 20
        })
    }
}