export default class ArrayBindingViewModel extends crs.classes.ViewBase {
    async collection1() {
        this.setProperty("items", [
            { code: "Code 1" },
            { code: "Code 2" },
            { code: "Code 3" },
            { code: "Code 4" },
            { code: "Code 5" }
        ])
    }

    async collection2() {
        this.setProperty("items", [
            { code: "Code 6" },
            { code: "Code 7" },
            { code: "Code 8" },
            { code: "Code 9" },
            { code: "Code 10" }
        ])
    }
}