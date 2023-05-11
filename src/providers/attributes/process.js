import {parseEvent} from "./utils/parse-event.js";
import {clear} from "./utils/clear-events.js";
import {processEvent} from "./utils/process-event.js";

/**
 * @class ProcessProvider
 * @description Provides the ability to run crs-process process actions from an event
 *
 * @example
 * <button click.process="{type: 'console', action: 'log', args: {messages: [$context.value, 'world']}}">Execute Step</button>
 *
 * @example expressions
 * {type: 'console', action: 'log', args: {messages: [$context.value, 'world']}}
 * {type: 'console', action: 'log', args: {message: [$event.clientX, $event.clientY]}}
 * test_schema[main(x: $event.clientX, y: $event.clientY)]
 *
 * Note that you can include values from the context and event in the args.
 */
export default class ProcessProvider {
    #events = {};
    #onEventHandler = this.#onEvent.bind(this);
    get events() { return this.#events; }

    async #onEvent(event) {
        await processEvent(event, this.#events, async (elementData) => {
            await callProcess(elementData, event);
        });
    }

    async parse(attr, context) {
        parseEvent(attr, this.#events, this.#onEventHandler, createProcessIntent);
    }

    async clear(uuid) {
        clear(uuid, this.#events, this.#onEventHandler);
    }
}

function createProcessIntent(exp) {
    if (exp.startsWith("{")) {
        return createStepIntent(exp);
    }

    return createSchemaIntent(exp);
}

function createStepIntent(exp) {
    // {type: 'console', action: 'log', args: {messages: [$context.value, 'world']}}
    // {type: 'console', action: 'log', args: {message: [$event.clientX, $event.clientY]}}

    const parts = exp.split(",").map(item => item.trim());
    const type = parts[0].replace("type:", "").replaceAll("'", "").replace("{", "").trim();
    const action = parts[1].replace("action:", "").replaceAll("'", "").trim();

    const argsExp = parts.slice(2).join(",");
    const args = createArgs(argsExp.slice(0, -1));

    return { type, action, args }
}

function createSchemaIntent(exp) {
    // test_schema[main(x: $event.clientX, y: $event.clientY)]
    const schemaParts = exp.split("[").map(item => item.trim());
    const schema = schemaParts[0].trim();
    const stepParts = schemaParts[1].split("(").map(item => item.trim());
    const step = stepParts[0].trim();

    const args = createArgs(`{${stepParts[1].replace(")]", "")}}`);

    return { schema, step, args }
}

function createArgs(exp) {
    let trimmedString = exp.slice(1, -1).trim();

    // Test for an empty object
    if (trimmedString.length == 0) {
        return {};
    }

    trimmedString = markArrays(trimmedString);
    const properties = trimmedString.split(',');

    // Create an empty object
    const obj = {};

    for (const property of properties) {
        const propertyParts = property.split(":").map(item => item.trim());
        const name = propertyParts[0];
        const value = processPropertyValue(propertyParts[1]);
        obj[name] = value;
    }

    return obj;
}

function processPropertyValue(exp) {
    if (exp.startsWith("[")) {
        return exp.slice(1, -1).split("&44").map(item => item.replaceAll("'", "").trim());
    }

    return exp;
}

/**
 * @method markArrays - this function looks for arrays in the expression and replaces commas with &44
 * @param exp
 */
function markArrays(exp, lookStart = 0) {
    if (exp.indexOf("[") === -1) {
        return exp;
    }

    let startIndex = exp.indexOf("[", lookStart);

    if (startIndex === -1) {
        return exp;
    }

    let endIndex = exp.indexOf("]", startIndex);

    const oldArray = exp.substring(startIndex, endIndex + 1);
    const newArray = oldArray.replaceAll(",", "&44");

    exp = exp.replace(oldArray, newArray);
    return markArrays(exp, endIndex + 1);
}

async function callProcess(intent, event) {

}