export default class TextProvider {
    #store = {};

    get store() { return this.#store; }

    async parseElement(element, context) {
        if (element.textContent.length == 0) return "";

        if (element.textContent.indexOf("${") !== -1 || element.textContent.indexOf("&{") !== -1) {
            const value = element.textContent;
            element.textContent = "";

            crs.binding.utils.markElement(element, context.bid);
            const expo = await crs.binding.expression.compile(value);
            this.#store[element["__uuid"]] = expo.key;

            crs.binding.data.setCallback(element["__uuid"], context.bid, expo.parameters.properties);
        }

    }

    async update(uuid) {
        const element = crs.binding.elements[uuid];
        const data = crs.binding.data.getDataForElement(element);
        const storeItem  = this.#store[uuid];
        const expo = crs.binding.functions.get(storeItem);

        const result = await expo.function(data);
        element.textContent = result == "undefined" ? "" : result;
    }
}