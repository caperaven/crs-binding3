export default class CollectionViewModel extends crs.classes.ViewBase {
    async preLoad() {
        this.setProperty("items", [
            {
                id: 1,
                name: "Item 1",
                sub_items: [
                    { id: 1, name: "Subitem 1" },
                    { id: 2, name: "Subitem 2" }
                ]
            },
            {
                id: 2,
                name: "Item 2",
                sub_items: [
                    { id: 1, name: "Subitem 3" },
                    { id: 2, name: "Subitem 4" }
                ]
            }
        ])
    }
}