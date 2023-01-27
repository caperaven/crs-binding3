import "../../expressions/code-factories/case.js";

/**
 * @class AttrCaseProvider
 * @description Provider that deals with the .case attribute. It is used to create a switch statement.
 *
 * @example
 * <div data-value.case="age <= 10: 'red', age <= 20: 'blue', default: 'green'" class="attr">Attr: </div>
 */
export default class AttrCaseProvider {
    async parse(attr, context) {
    }

    async update(uuid, ...properties) {
    }
}