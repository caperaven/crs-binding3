import "../../expressions/code-factories/if.js";

/**
 * @class ClassListIfProvider
 * @description Add and remove classes on a element based on a if expression.
 *
 * @example <caption>if expression, add class if expression passes else remove it</caption>
 * <div classlist.if="age <= 10 ? 'red'">Class list Test</div>
 *
 * @example <caption>if expression with a default</caption>
 * <div classlist.if="age <= 10 ? 'red' : 'green'">Class list Test</div>
 */
export default class ClassListIfProvider {
    async parse(attr, context) {
    }

    async update(uuid, ...properties) {
    }
}