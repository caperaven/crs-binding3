import "./child-details.js";

export default class DeeperProperties extends crs.classes.ViewBase {
    setPerson() {
        this.setProperty("person", {
            firstName: "Darth",
            lastName: "Vader",
            child: {
                firstName: "Luke",
                lastName: "Skywalker"
            }
        })
    }

    setChild() {
        this.setProperty("person.child", {
            firstName: "Sheldon",
            lastName: "Cooper"
        })
    }

    setChildFirstName() {
        this.setProperty("person.child.firstName", "Howard");
    }
}