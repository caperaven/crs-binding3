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
        const uuid = event.target["__uuid"];
        if (uuid == null) return;

        const data = this.#events[event.type];
        console.log(data);
    }

    async parse(attr, context) {
        const parts = attr.name.split(".");
        const event = parts[0];

        if (this.#events[event] == null) {
            document.addEventListener(event, this.#onEventHandler);
            this.#events[event] = {}
        }

        // refine this to be more specific
        //this.#events[event][attr.ownerElement["__uuid"]] = attr.value;

        const src = createSourceFrom.call(this, attr.value, context);
        console.log(src);

        attr.ownerElement.removeAttribute(attr.name);
    }

    async clear(uuid) {
        for (const event of Object.keys(this.#events)) {

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
    const isExp = exp.indexOf("==") != -1;
    const index = exp.indexOf("=");
    const left = exp.substring(0, index).trim();
    const right = exp.substring(index + 1, exp.length).trim();

    console.log(left, right);
    const leftCode = getLeft(left, context);
    const rightCode = getRight(right, context, left);

    return leftCode.replace("__value__", rightCode);
}

function getLeft(exp, context) {
    if (exp.indexOf("attr(") != -1) {
        return genAttr(exp);
    }

    if (exp.indexOf("prop(") != -1) {
        return genProp(exp);
    }

    if (exp.indexOf("$global") != -1) {
        return getGlobalSetter(exp);
    }

    return `crs.binding.data.setProperty(${context}, "${exp}", __value__);`;
}

function getRight(exp, context, left) {
    if (exp.indexOf("attr(") != -1) {
        return genAttr(exp);
    }

    if (exp.indexOf("prop(") != -1) {
        return genProp(exp);
    }

    if (exp.indexOf("$global") != -1) {
        return getGlobalGetter(exp);
    }

    if (exp.indexOf(left) != -1) {
        exp = exp.replace(left, `crs.binding.data.getProperty(${context}, "${left}")`);
    }

    return exp;
}

function genAttr(exp) {
    const parts = exp.replace("attr(", "").replace(")", "").split(",");
    const query = parts[0].trim();
    const attr = parts[1].trim();
    const global = parts[2].trim() == "true";

    const code = [
        `const ${query.remove("#").remove(".")}Element = ${global ? "document" : "element"}.querySelector(${query});`,
    ];
}

function genProp(exp) {
    const parts = exp.replace("property(", "").replace(")", "").split(",");
    const query = parts[0].trim();
    const property = parts[1].trim();
    const global = parts[2].trim() == "true";

    const code = [
        `const ${query.remove("#").remove(".")}Element = ${global ? "document" : "element"}.querySelector(${query});`,
    ];
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
