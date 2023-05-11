/**
 * Parse an attribute for event based markup.
 * @param attr {Attr} - The attribute to parse.
 * @param events {Object} - The events object to add the event to.
 * @param eventHandler {Function} - The event handler to add to the document.
 * @param callback {Function} - The callback to create the intent.
 */
export function parseEvent(attr, events, eventHandler, callback) {
    const intent = callback(attr.value);
    const parts = attr.name.split(".");
    const event = parts[0];

    if (events[event] == null) {
        document.addEventListener(event, eventHandler);
        events[event] = {};
    }

    events[event][attr.ownerElement["__uuid"]] = intent;
    attr.ownerElement.removeAttribute(attr.name);
}