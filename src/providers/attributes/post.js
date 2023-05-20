import {createEventPacket, createEventParameters} from "./utils/create-event-parameters.js";
import {parseEvent} from "./utils/parse-event.js";

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
    async onEvent(event, bid, intent) {
        await post(intent.value, event);
    }

    async parse(attr) {
        parseEvent(attr, this.getIntent);
    }

    async getIntent(attrValue) {
        const parts = attrValue.split("(");
        const queryParts = parts[0].split("[");
        const event = queryParts[0].trim();
        const queries = queryParts[1].replace("]", "").split(",").map(q => q.trim().replaceAll("'", ""));

        const value = createEventParameters(event, parts[1].replace(")", ""));
        value.queries = queries;

        return { provider: ".post", value };
    }

    async clear(uuid) {
        crs.binding.eventStore.clear(uuid);
    }
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