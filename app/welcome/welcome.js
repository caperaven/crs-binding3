import "./my-component.js";

export default class Welcome extends crs.classes.ViewBase {
    get mobi() {
        return import.meta.url.replace(".js", ".mobi.html");
    }

    async preLoad() {
        await crs.binding.translations.add({
            firstName: "First Name",
            lastName: "Last Name",
            age: "Age"
        }, "person")

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

    async splice() {
        const array = this.getProperty("people");
        array.splice(0, 1,
            {
                firstName: "First Name 1",
                lastName: "Last Name 1",
                age: 20
            },
            {
                firstName: "First Name 2",
                lastName: "Last Name 2",
                age: 21
            })
    }

    async pop() {
        const array = this.getProperty("people");
        array.pop();
    }

    async shift() {
        const array = this.getProperty("people");
        array.shift();
    }
}