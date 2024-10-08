export default class TextProvider {
    #store = {};

    get store() { return this.#store; }

    /**
     * Parses the text content of the given element
     * If the text content contains an expression, it compiles the expression
     * and stores the result in the store
     * @param element {Element} - The element to parse
     * @param context {Context} - The context of the element
     * @returns {Promise<string>}
     */
    async parseElement(element, context) {
        if (element.textContent.length == 0) return "";

        if (element.textContent.indexOf("${") !== -1 || element.textContent.indexOf("&{") !== -1) {
            const value = element.textContent;
            element.textContent = "";

            crs.binding.utils.markElement(element, context);
            const expo = await crs.binding.expression.compile(value);
            this.#store[element["__uuid"]] = expo.key;

            crs.binding.data.setCallback(element["__uuid"], context.bid, expo.parameters.properties, ".textContent");

            if (value.indexOf("&{") != -1) {
                await this.update(element["__uuid"]);
            }
        }
    }

    /**
     * Updates the text content of the element with the given uuid with the result of the expression
     * @param uuid {string} - The uuid to clear
     * @returns {Promise<void>}
     */
    async update(uuid) {
        const element = crs.binding.elements[uuid];
        const expr  = this.#store[uuid];
        const expo = crs.binding.functions.get(expr);

        const data = crs.binding.data.getDataForElement(element);

        const result = await expo.function(data);
        element.textContent = result == "undefined" ? "" : result;
    }

    /**
     * Clears the store for the given uuid
     * @param uuid {string} - The uuid to clear
     * @returns {Promise<void>}
     */
    async clear(uuid) {
        const fnKey = this.#store[uuid];
        if (fnKey == null) return;

        const exp = crs.binding.functions.get(fnKey);
        crs.binding.expression.release(exp);

        delete this.#store[uuid];
    }
}