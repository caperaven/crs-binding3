import "./my-component.js";

export default class BindingViewModel extends crs.classes.ViewBase {
    #callbackHandler = (property, newValue, oldValue) => console.log(property, newValue, oldValue);

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
            age: 30,
            addAge: ()=> {
                this.setProperty("person.age", this.getProperty("person.age") + 1);
            }
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

        this.setProperty("greeting", "Welcome to one-way binding");
        crs.binding.data.addContextCallback(this.bid, this.#callbackHandler);
    }

    async disconnectedCallback() {
        await crs.binding.translations.delete("person");
        this.#callbackHandler = null;
        await super.disconnectedCallback();
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

    async onEvent(event) {
        console.log(event);
    }
}