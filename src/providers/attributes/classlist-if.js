import {ClassListBase} from "./classlist-base.js";

/**
 * @class ClassListIfProvider
 * @description Add and remove classes on a element based on a if expression.
 *
 * @example <caption>html, if expression, add class if expression passes else remove it</caption>
 * <div classlist.if="age <= 10 ? 'red'">Class list Test</div>
 *
 * @example <caption>html, if expression with a default</caption>
 * <div classlist.if="age <= 10 ? 'red' : 'green'">Class list Test</div>
 *
 * @example <caption>html, using arrays in the expression</caption>
 * <div classlist.if="age <= 10 ? ['red', 'green'] : ['blue', 'yellow']">Class list Test</div>
 */
export default class ClassListIfProvider extends ClassListBase {
    get providerKey() { return "classlist.if"; }

    async parse(attr, context) {
        const classes = getIfClasses(attr.value);

        await super.parse(attr, context, classes, async (value) => {
            return await crs.binding.expression.ifFactory(value);
        });
    }
}

/**
 * In a ternary expressin extract the classes to add and remove.
 * @param exp {string} - The expression to parse.
 */
function getIfClasses(exp) {
    const parts = exp.split("?");

    const valuesPart = parts[1]
        .replaceAll("[", "")
        .replaceAll("]", ":")
        .replaceAll(",", ":")
        .replaceAll("'", "")
        .split(":")
        .map(item => item.trim())
        .filter(item => item.length > 0);

    const classes = valuesPart;
    const set = new Set(classes);

    return Array.from(set);
}