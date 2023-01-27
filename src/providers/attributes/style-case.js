import "../../expressions/code-factories/case.js";

/**
 * Set an element style based on a case expression.
 * These are processed as if statements, the first condition that passes will set the style.
 *
 * @example <caption>case expression</caption>
 * <div style.background.case="age <= 10: 'red', age <= 20: 'blue', default: 'green'">Style Test</div>
 *
 * if (age <= 10) set background to 'red'
 * if (age <= 20) set background to 'blue'
 * if the first two conditions don't pass set background to 'green'
 */
export default class StyleCaseProvider {
    async parse(attr, context) {
    }

    async update(uuid, ...properties) {
    }
}