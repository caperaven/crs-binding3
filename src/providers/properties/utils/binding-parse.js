export async function bindingParse(attr, context, store, provider) {
    const parts = attr.name.split(".");
    const element = attr.ownerElement;
    const property = parts[0];
    const path = attr.value;

    crs.binding.utils.markElement(element, context);
    element.removeAttribute(attr.name);
    element.setAttribute("data-field", path);

    const eventObj = store[element["__uuid"]] ||= {};
    eventObj[path] = property;

    crs.binding.data.setCallback(element["__uuid"], context.bid, [path], provider);
}