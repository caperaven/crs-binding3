import { clear } from "./utils/clear-events.js";
import {createEventPacket, createEventParameters} from "./utils/create-event-parameters.js";

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
        const target = event.composedPath()[0] || event.target;
        const uuid = target["__uuid"];
        if (uuid == null) return;

        const data = this.#events[event.type];
        const elementData = data[uuid];

        if (elementData != null) {
            await post(elementData, event);
        }
    }

    async parse(attr, context) {
        const intent = createPostIntent(attr.value);
        const parts = attr.name.split(".");
        const event = parts[0];

        if (this.#events[event] == null) {
            document.addEventListener(event, this.#onEventHandler);
            this.#events[event] = {};
        }

        this.#events[event][attr.ownerElement["__uuid"]] = intent;
        attr.ownerElement.removeAttribute(attr.name);
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