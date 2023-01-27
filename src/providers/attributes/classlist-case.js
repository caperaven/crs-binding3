import "../../expressions/code-factories/case.js";

/**
 * @class ClassListCaseProvider
 * @description Add and remove classes on a element based on a case expression.
 * These are processed as if statements, the first condition that passes will set determine the class.
 *
 * @example
 * <div classlist.case="age <= 10: 'red', age <= 20: 'blue', default: 'green'">Class list Test</div>
 *
 * if (age <= 10) add class 'red' but remove 'blue' and 'green'
 * if (age <= 20) add class 'blue' but remove 'red' and 'green'
 * if the first two conditions don't pass add class 'green' but remove 'red' and 'blue'
 */
export default class ClassListCaseProvider {
    async parse(attr, context) {
    }

    async update(uuid, ...properties) {
    }
}