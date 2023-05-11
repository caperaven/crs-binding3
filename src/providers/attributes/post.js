import { clear } from "./utils/clear-events.js";
import {createEventPacket, createEventParameters} from "./utils/create-event-parameters.js";
import {parseEvent} from "./utils/parse-event.js";
import {processEvent} from "./utils/process-event.js";

/**
 * @class PostProvider
 * @description Provides the ability to post message to components.
 *
 * @example
 * <button click.post="got-contacts['input-contacts', 'input-form'](title='hello world', $event, contacts=${contacts})">Post Message</button>
 *
 * got-contacts is the value on the args on the "key" property.
 * The array defines a collection of css queries to find the elements to post the message to.
 * All the items between the () are the arguments to pass to the post method.
 */
export default class PostProvider {
    #events = {};
    #onEventHandler = this.#onEvent.bind(this);
    get events() { return this.#events; }

    async #onEvent(event) {
        await processEvent(event, this.#events, async (elementData) => {
            await post(elementData, event);
        });
    }

    async parse(attr, context) {
        parseEvent(attr, this.#events, this.#onEventHandler, createPostIntent);
    }

    async clear(uuid) {
        clear(uuid, this.#events, this.#onEventHandler);
    }
}

function createPostIntent(exp) {
    const parts = exp.split("(");
    const queryParts = parts[0].split("[");
    const event = queryParts[0].trim();
    const queries = queryParts[1].replace("]", "").split(",").map(q => q.trim().replaceAll("'", ""));

    const intent = createEventParameters(event, parts[1].replace(")", ""));
    intent.queries = queries;
    return intent;
}

async function post(intent, event) {
    const intentObj = Object.assign({}, intent);
    const queries = intentObj.queries;
    delete intentObj.queries;

    const args = createEventPacket(intent, event);
    args.key = intent.event;

    for (const query of queries) {
        document.querySelectorAll(query).forEach(element => {
            if (element.onMessage != null) {
                element.onMessage(args);
            }
        })
    }
}