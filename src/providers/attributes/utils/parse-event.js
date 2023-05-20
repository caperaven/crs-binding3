/**
 * Parse an attribute for event based markup.
 * @param attr {Attr} - The attribute to parse.
 * @param events {Object} - The events object to add the event to.
 * @param eventHandler {Function} - The event handler to add to the document.
 * @param callback {Function} - The callback to create the intent.
 */
export function parseEvent(attr, callback) {
    const element = attr.ownerElement;
    const intent = callback(attr.value, element["__bid"]);
    const parts = attr.name.split(".");
    const event = parts[0];

    const uuid = element["__uuid"];
    crs.binding.eventStore.register(event, uuid, intent);
    element.removeAttribute(attr.name);

    // place this on the element so that we can speed up the clean process.
    // see event-store.js for more info.
    element.__events ||= [];
    element.__events.push(event);
}