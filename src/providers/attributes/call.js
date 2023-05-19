import { clear } from "./utils/clear-events.js";
import { processEvent } from "./utils/process-event.js";
import {parseEvent} from "./utils/parse-event.js";

/**
 * @class CallProvider
 * @description This provider will execute a function on the binding context when an event is triggered.
 * Only a single event will be registered. No matter how many elements have the same event.
 * You can use this to listen to any event that gets dispatched.
 *
 * Scenarios
 * 1. no parameters
 * 2. event parameter
 * 3. event parameter and other parameters
 * 4. other parameters
 *
 * @example <caption>no parameters</caption>
 * <button click.call="doSomething">Click Me</button>
 *
 * @example <caption>event parameter</caption>
 * <button click.call="doSomething($event)">Click Me</button>
 *
 * @example <caption>event parameter and other parameters</caption>
 * <button click.call="doSomething($event, 'hello')">Click Me</button>
 *
 * @example <caption>other parameters</caption>
 * <button click.call="doSomething('hello')">Click Me</button>
 */
export default class CallProvider {
    /**
     * Handle the event and execute the function.
     * @param event {Event} - The event that was triggered.
     * @returns {Promise<void>}
     */
    async onEvent(event, bid, intent) {
        await execute(bid, intent.value, event);
    }

    /**
     * Parse the attribute and register the required data and events.
     * @param attr {Attr} - The attribute to parse.
     * @param context {Object} - The binding context.
     */
    async parse(attr, context) {
        parseEvent(attr, getIntent);
    }

    /**
     * Free the memory associated with this element based on it's uuid
     * @param uuid {string} - The uuid of the element.
     */
    async clear(uuid) {
        crs.binding.eventStore.clear(uuid);
    }
}

function getIntent(attrValue) {
    return { provider: ".call", value: attrValue }
}

/**
 * @function execute
 * @description Execute the function on the binding context.
 * @param bid {number} - The binding id.
 * @param expr {string} - The expression to execute.
 * @param event {Event} - The event that was triggered.
 * @returns {Promise<void>}
 */
async function execute(bid, expr, event) {
    const context = crs.binding.data.getContext(bid);
    if (context == null) return;

    const parts = expr.replace(")", "").split("(");
    const fn = parts[0];

    const args = parts.length == 1 ? [event] : processArgs(parts[1], event);
    await context[fn].call(context, ...args);
}

/**
 * @function processArgs
 * @description Process the arguments and convert them to the correct type.
 * @param expr {string} - The expression to process.
 * @param event {Event} - The event that was triggered.
 * @returns {*[]}
 */
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