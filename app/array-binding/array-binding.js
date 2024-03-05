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
            { code: "Code 10" },
            { code: "Code 11" }
        ])
    }

    async update() {
        const items = this.getProperty("items");
        items.push({ code: "Code 12", selected: true });
        items.push({ code: "Code 13" });
        // items[0].code = "Code 1 Updated";
        // debugger;
        // this.setProperty("items[0].code", "Code 1 Updated");
    }
}