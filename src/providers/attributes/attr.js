export default class AttrProvider {
    #store = {};

    get store() { return this.#store; }

    async parse(attr, context) {
        const attrName = attr.name.split(".")[0];
        const element = attr.ownerElement;
        element.removeAttribute(attr.name);

        crs.binding.utils.markElement(element, context.bid);
        const expo = await crs.binding.expression.compile(attr.value);
        const obj = this.#store[element["__uuid"]] ||= {};

        for (const property of expo.parameters.properties) {
            obj[property] = {
                [attrName]: expo.key
            }
        }
    }

    async update(uuid, ...properties) {
        if (this.#store[uuid] == null) return;

        const element = crs.binding.elements[uuid];
        const data = crs.binding.data.getDataForElement(element);
        const storeItem  = this.#store[uuid];

        for (const property of properties) {
            const attributes = Object.keys(storeItem[property]);
            for (const attribute of attributes) {
                const fnKey = storeItem[property][attribute];
                const expo = crs.binding.functions.get(fnKey);
                const result = await expo.function(data);
                element.setAttribute(attribute, result);
            }
        }
    }
}