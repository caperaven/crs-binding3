export default class CallProvider {
    #events = {};
    #onEventHandler = this.#onEvent.bind(this);

    get events() {
        return this.#events;
    }

    async #onEvent(event) {
        const uuid = event.target["__uuid"];
        if (uuid == null) return;

        const data = this.#events[event.type];
        const elementData = data[uuid];

        if (elementData != null) {
            await execute(event.target["__bid"], elementData, event);
        }
    }

    /**
     * Parse the attribute and register the required data and events.
     */
    async parse(attr, context) {
        const parts = attr.name.split(".");
        const event = parts[0];

        if (this.#events[event] == null) {
            document.addEventListener(event, this.#onEventHandler);
            this.#events[event] = {}
        }

        this.#events[event][attr.ownerElement["__uuid"]] = attr.value;
        attr.ownerElement.removeAttribute(attr.name);
    }

    /**
     * Free the memory associated with this element based on it's uuid
     */
    async clear(uuid) {
        for (const event of Object.keys(this.#events)) {
            delete this.#events[event][uuid];

            // if no more items use the event, remove the event listener
            if (Object.keys(this.#events[event]).length === 0) {
                delete this.#events[event];
                document.removeEventListener(event, this.#onEventHandler);
            }
        }
    }
}

async function execute(bid, expr, event) {
    const context = crs.binding.data.getContext(bid);
    if (context == null) return;

    const parts = expr.replace(")", "").split("(");
    const fn = parts[0];

    const args = parts.length == 1 ? [event] : processArgs(parts[1], event);
    await context[fn].call(context, ...args);
}

function processArgs(expr, event) {
    const args = [];
    const parts = expr.split(",");

    for (let part of parts) {
        part = part.trim();

        if (part === "$event") {
            args.push(event);
        }
        else if (Number.isNaN(part) == true) {
            args.push(Number(part));
        }
        else {
            args.push(part);
        }
    }

    return args;
}