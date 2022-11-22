export default class CallProvider {
    #events = {};
    #onEventHandler = this.#onEvent.bind(this);

    #onEvent(event) {
        const uuid = event.target.dataset.uuid;
        if (uuid == null) return;

        const data = this.#events[event.type];
        const elementData = data[uuid];
        console.log(elementData);
    }

    /**
     * Parse the attribute and register the required data and events.
     */
    async parse(attr, context, ctxName, parentId) {
        const parts = attr.name.split(".");
        const event = parts[0];

        if (this.#events[event] == null) {
            document.addEventListener(event, this.#onEventHandler);
            this.#events[event] = {}
        }

        this.#events[event][attr.ownerElement.dataset.uuid] = attr.value;
    }

    /**
     * Free the memory associated with this element based on it's uuid
     */
    async clear(element) {
        if (element.dataset.uuid == null) return;

        for (const event of Object.keys(this.#events)) {
            delete this.#events[event][element.dataset.uuid];

            // if no more items use the event, remove the event listener
            if (Object.keys(this.#events[event]).length === 0) {
                delete this.#events[event];
                document.removeEventListener(event, this.#onEventHandler);
            }
        }
    }
}