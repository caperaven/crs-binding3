export default class TextProvider {
    #store = {};

    async parseElement(element, context) {
        if (element.textContent.length == 0) return "";

        if (element.textContent.indexOf("${") !== -1 || element.textContent.indexOf("&{") !== -1) {
            crs.binding.utils.markElement(element, context.bid);
            const expo = await crs.binding.expression.compile(element.textContent);
            this.#store[element["__uuid"]] = expo.key;
        }
    }

    async update(uuid) {
        const element = crs.binding.elements[uuid];
        const data = crs.binding.data.getDataForElement(element);
        const storeItem  = this.#store[uuid];
        const expo = crs.binding.functions.get(storeItem);

        const result = await expo.function(data);
        element.textContent = result;
    }
}