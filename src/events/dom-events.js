/**
 * @function enableEvents - This enables the registerEvent and unregisterEvent functions on the element, allowing
 * that element to auto manage events.
 * @param element {HTMLElement} - The element to enable events on.
 */
export function enableEvents(element) {
    element._domEvents = [];
    element.registerEvent = registerEvent;
    element.unregisterEvent = unregisterEvent;
}

/**
 * @function disableEvents - This disables the registerEvent and unregisterEvent functions on the element, and
 * removes all events that were registered on the element.
 * If you don't call this function on dispose, you will have a memory leak.
 * @param element {HTMLElement} - The element to disable events on.
 */
export function disableEvents(element) {
    if (element._domEvents == null) return;
    for (let event of element._domEvents) {
        element.removeEventListener(event.event, event.callback);
        delete event.element;
        delete event.callback;
        delete event.event;
    }
    element._domEvents.length = 0;
    delete element._domEvents;
    delete element.registerEvent;
    delete element.unregisterEvent;
}

/**
 * @function registerEvent - This registers an event on the element, and adds it to the list of events to be
 * removed when the element is disposed.
 * @param element {HTMLElement} - The element to register the event on.
 * @param event {Event} - The event to register.
 * @param callback {Function} - The callback to register.
 * @param eventOptions {Object} - The event options to register.
 */
function registerEvent(element, event, callback, eventOptions = null) {
    const target = element.shadowRoot || element;
    target.addEventListener(event, callback, eventOptions);

    this._domEvents.push({
        element: target,
        event: event,
        callback: callback
    })
}

/**
 * @function unregisterEvent - This unregisters an event on the element, and removes it from the list of events to be
 * removed when the element is disposed.
 * In those times when you want to remove an event before the element is disposed.
 * @param element {HTMLElement} - The element to unregister the event on.
 * @param event {Event} - The event to unregister.
 * @param callback {Function} - The callback to unregister.
 */
function unregisterEvent(element, event, callback) {
    const item = this._domEvents.find(item => item.element == element && item.event == event && item.callback == callback);
    if (item == null) return;

    const target = element.shadowRoot || element;
    target.removeEventListener(item.event, item.callback);

    this._domEvents.splice(this._domEvents.indexOf(item), 1);
    delete item.element;
    delete item.callback;
    delete item.event;
}