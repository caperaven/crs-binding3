/**
 * @function processEvent - Process the event and check if the store has anything to execute.
 * if it does use the callback for particular execution logic
 * @param event - The event to process
 * @param events - The events object to check for the event
 * @param callback - The callback to execute if the event is found
 * @returns {Promise<void>}
 */
export async function processEvent(event, callback) {
    const target = event.composedPath()[0] || event.target;
    const uuid = target["__uuid"];
    if (uuid == null) return;

    const data = crs.binding.eventStore[event.type];
    const elementData = data[uuid];

    if (elementData != null) {
        const bid = target["__bid"];
        await callback(elementData, bid);
    }
}