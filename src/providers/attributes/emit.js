import "./../../events/event-emitter.js";
import {createEventParameters} from "./utils/create-event-parameters.js";
import {clear} from "./utils/clear-events.js";

/**
 * @class EmitProvider
 * @description This provider allows you to call the event emitter directly from the HTML based on your expression
 *
 * @example
 * <button click.emit="customEvent">Click Me</button>
 *
 * This is a simple example with no parameters.
 *
 * @example
 * <button click.emit="customEvent(title='hello world', $event, $context)">Click Me</button>
 *
 * customEvent = the event registered on the emitter using the "on" method
 * title = the first parameter
 * $event = the second parameter
 * $context = the third parameter
 *
 * you can have any amount of parameters, each is a property in the arguments object
 * $event will set an event property in the arguments object
 * $context will set a context property in the arguments object
 *
 * In addition, you can pass in a parameter based on a value in the binding context
 *
 * my_contacts=${contacts}
 * the above will set a "my_contacts" property in the arguments object.
 * this property will be set to the value of the "contacts" property in the binding context
 */
export default class EmitProvider {
    #events = {};
    #onEventHandler = this.#onEvent.bind(this);
    get events() { return this.#events; }

    async #onEvent(event) {
        const target = event.composedPath()[0] || event.target;
        const uuid = target["__uuid"];
        if (uuid == null) return;

        const data = this.#events[event.type];
        const elementData = data[uuid];

        if (elementData != null) {
            await emit(elementData, event);
        }
    }

    /**
     * Parse the attribute and register the required data and events.
     * @param attr {Attr} - The attribute to parse.
     * @param context {Object} - The binding context.
     */
    async parse(attr, context) {
        const intent = createEventIntent(attr.value);
        const parts = attr.name.split(".");
        const event = parts[0];

        if (this.#events[event] == null) {
            document.addEventListener(event, this.#onEventHandler);
            this.#events[event] = {};
        }

        this.#events[event][attr.ownerElement["__uuid"]] = intent;
        attr.ownerElement.removeAttribute(attr.name);
    }

    /**
     * Free the memory associated with this element based on it's uuid
     * @param uuid {string} - The uuid of the element.
     */
    async clear(uuid) {
        clear(uuid, this.#events, this.#onEventHandler);
    }
}

function createEventIntent(exp) {
    // 1. get the events
    const parts = exp.split("(");
    const event = parts[0];

    if (parts.length === 1) return { event, args: {} };

    // 2. remove the last bracket
    parts[1] = parts[1].replace(")", "");

    // 3. get the parameters
    return createEventParameters(event, parts[1])
}

function emit(intent, event) {
    const data = intent.args;
    const args = {};

    for (const tuple of Object.entries(data)) {
        if (tuple[1] === "$event") {
            args["event"] = event;
            continue;
        }

        if (tuple[1] === "$context") {
            const bid = event.target["__bid"];
            const context = crs.binding.data.getContext(bid);
            args["context"] = context;
            continue;
        }

        const bid = event.target["__bid"];
        let exp = tuple[1];
        let value = exp;

        if (exp.startsWith("${")) {
            exp = exp.replace("${", "").replace("}", "");
            value = crs.binding.data.getProperty(bid, exp);
        }

        args[tuple[0]] = value;
    }

    crs.binding.events.emitter.emit(intent.event, args).catch(error => console.error(error));
}