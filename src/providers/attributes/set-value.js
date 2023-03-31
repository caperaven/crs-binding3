/**
 * "$setvalue(state = state == 'state1' ? 'state2' : 'state1')"
 * "crs.binding.setvalue(`state = state == 'state1' ? 'state2' : 'state1'`)"
 *
 *
 * "$setvalue(state = attr('#input', 'value', true) == '1' ? 'state1' : 'state2')"
 * "$setvalue(state = prop('#input', 'value', true) == '1' ? 'state1' : 'state2')"
 */

export default class SetValueProvider {
    #events = {};
    #onEventHandler = this.#onEvent.bind(this);

    async #onEvent(event) {
        const target = event.composedPath()[0] || event.target;
        const uuid = target["__uuid"];
        if (uuid == null) return;

        const data = this.#events[event.type];
        const fn = data[uuid];
        await fn(event, target);
    }

    async parse(attr, context) {
        const parts = attr.name.split(".");
        const event = parts[0];

        if (this.#events[event] == null) {
            document.addEventListener(event, this.#onEventHandler);
            this.#events[event] = {}
        }

        const uuid = attr.ownerElement["__uuid"];
        const src = createSourceFrom.call(this, attr.value, context.bid);
        this.#events[event][uuid] = new globalThis.crs.classes.AsyncFunction("event", "element", src);

        attr.ownerElement.removeAttribute(attr.name);
    }

    async clear(uuid) {
        for (const event of Object.keys(this.#events)) {
            if (this.#events[event][uuid] != null) {
                delete this.#events[event][uuid];
            }
        }
    }
}

/**
 * Examples we need to cater for:
 * "$setvalue(state = state == 'state1' ? 'state2' : 'state1')"
 * "crs.binding.setvalue(`state = state == 'state1' ? 'state2' : 'state1'`)"
 *
 *
 * "$setvalue(state = attr('#input', 'value', true) == '1' ? 'state1' : 'state2')"
 * "$setvalue(state = prop('#input', 'value', true) == '1' ? 'state1' : 'state2')"
 */
export function createSourceFrom(exp, context) {
    const index = exp.indexOf("=");
    const left = exp.substring(0, index).trim();
    const right = exp.substring(index + 1, exp.length).trim();

    const preArray = [];
    const leftCode = getLeft(left, context, preArray);
    const rightCode = getRight(right, context, left, preArray);

    return [...preArray, leftCode.replace("__value__", rightCode)].join(" ");
}

function getLeft(exp, context, preArray) {
    if (exp.indexOf("attr(") != -1) {
        return setAttr(exp, preArray);
    }

    if (exp.indexOf("prop(") != -1) {
        return setProp(exp, preArray);
    }

    if (exp.indexOf("$global") != -1) {
        return getGlobalSetter(exp);
    }

    return `crs.binding.data.setProperty(${context}, "${exp}", __value__);`;
}

function getRight(exp, context, left, preArray) {
    if (exp.indexOf("attr(") != -1) {
        return genAttr(exp, preArray);
    }

    if (exp.indexOf("prop(") != -1) {
        return genProp(exp, preArray);
    }

    if (exp.indexOf("$global") != -1) {
        return getGlobalGetter(exp);
    }

    if (exp.indexOf(left) != -1) {
        exp = exp.replace(left, `crs.binding.data.getProperty(${context}, "${left}")`);
    }

    exp = exp.replace("$event", "event");

    return exp;
}

function genAttr(exp, preArray) {
    const parts = exp.replace("attr(", "").replace(")", "").split(",");
    const query = parts[0].trim();
    const attr = parts[1].trim();
    const right = parts[2].trim();
    const rightParts = right.split(" ");
    const global = rightParts[0] == "true";

    if (query == "$element") {
        preArray.push(`const getAttrElement = element;`);
    }
    else {
        preArray.push(`const getAttrElement = ${global ? "document" : "element"}.querySelector("${query}");`);
    }

    preArray.push(`const attrValue = getAttrElement.getAttribute("${attr}");`);

    const index = exp.indexOf(")");
    const array = Array.from(exp);
    array.splice(0, index + 1, "attrValue");

    return array.join("");
}

function setAttr(exp, preArray) {
    const parts = exp.replace("attr(", "").replace(")", "").split(",");
    const query = parts[0].trim();
    const attr = parts[1].trim();
    const right = parts[2].trim();
    const rightParts = right.split(" ");
    const global = rightParts[0] == "true";

    if (query == "$element") {
        preArray.push(`const setAttrElement = element;`);
    }
    else {
        preArray.push(`const setAttrElement = ${global ? "document" : "element"}.querySelector("${query}");`);
    }

    return `setAttrElement.setAttribute("${attr}", __value__);`;
}

function genProp(exp, preArray) {
    const parts = exp.replace("prop(", "").replace(")", "").split(",");
    const query = parts[0].trim();
    const property = parts[1].trim();
    const right = parts[2].trim();
    const rightParts = right.split(" ");
    const global = rightParts[0] == "true";

    if (query == "$element") {
        preArray.push(`const getPropElement = element;`);
    }
    else {
        preArray.push(`const getPropElement = ${global ? "document" : "element"}.querySelector("${query}");`);
    }

    preArray.push(`const propValue = getPropElement["${property}"];`);

    const index = exp.indexOf(")");
    const array = Array.from(exp);
    array.splice(0, index + 1, "propValue");

    return array.join("");
}

function setProp(exp, preArray) {
    const parts = exp.replace("prop(", "").replace(")", "").split(",");
    const query = parts[0].trim();
    const property = parts[1].trim();
    const right = parts[2].trim();
    const rightParts = right.split(" ");
    const global = rightParts[0] == "true";

    if (query == "$element") {
        preArray.push(`const setPropElement = element;`);
    }
    else {
        preArray.push(`const setPropElement = ${global ? "document" : "element"}.querySelector("${query}");`);
    }

    return `setPropElement["${property}"] = __value__;`;
}

function getGlobalSetter(exp) {
    return `crs.binding.data.setProperty(0, "${exp.replace("$globals.", "")}", __value__);`;
}

function getGlobalGetter(exp) {
    const parts = exp.split("$globals.");
    const propPart = exp.substring(exp.indexOf("$globals.") + 9, exp.length);
    const propPartParts = propPart.split(" ");
    const path = propPartParts[0];

    const replacement = `crs.binding.data.getProperty(0, "${path}")`;
    parts[1] = parts[1].replace(path, "");
    return parts.join(replacement);
}
