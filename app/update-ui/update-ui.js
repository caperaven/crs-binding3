export default class UpdateUIViewModel extends crs.classes.ViewBase {
    async preLoad() {
        this.setProperty("person", {
            firstName: "John",
            lastName: "Doe",
            age: 25
        })
    }

    async update() {
        const person = this.getProperty("person");
        person.firstName = "Jane";
        person.lastName = "Smith";
        person.age = 30;

        crs.binding.data.updateUI(this.bid, "person");
    }
}