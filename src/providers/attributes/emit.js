import "./../../events/event-emitter.js";
import {createEventPacket, createEventParameters} from "./utils/create-event-parameters.js";
import {parseEvent} from "./utils/parse-event.js";

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
    async onEvent(event, bid, intent) {
        await emit(intent.value, event);
    }

    /**
     * Parse the attribute and register the required data and events.
     * @param attr {Attr} - The attribute to parse.
     * @param context {Object} - The binding context.
     */
    async parse(attr, context) {
        parseEvent(attr, this.getIntent);
    }

    async getIntent(attrValue) {
        const parts = attrValue.split("(");
        const event = parts[0];

        if (parts.length === 1) return { provider: ".emit", value: { event, args: {} } };

        // 2. remove the last bracket
        parts[1] = parts[1].replace(")", "");

        // 3. get the parameters
        const value =  createEventParameters(event, parts[1])

        return { provider: ".emit", value }
    }

    /**
     * Free the memory associated with this element based on it's uuid
     * @param uuid {string} - The uuid of the element.
     */
    async clear(uuid) {
        crs.binding.eventStore.clear(uuid);
    }
}

function emit(intent, event) {
    const args = createEventPacket(intent, event);
    crs.binding.events.emitter.emit(intent.event, args).catch(error => console.error(error));
}