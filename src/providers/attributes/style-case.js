import "../../expressions/code-factories/case.js";
import {StyleBase} from "./style-base.js";

/**
 * @class StyleCaseProvider
 * @description Set an element style based on a case expression.
 * These are processed as if statements, the first condition that passes will set the style.
 *
 * @example <caption>case expression</caption>
 * <div style.background.case="age <= 10: 'red', age <= 20: 'blue', default: 'green'">Style Test</div>
 *
 * if (age <= 10) set background to 'red'
 * if (age <= 20) set background to 'blue'
 * if the first two conditions don't pass set background to 'green'
 */
export default class StyleCaseProvider extends StyleBase {
    async parse(attr, context) {
        await super.parse(attr, context, async (value) => {
            return await crs.binding.expression.caseFactory(value);
        });
    }
}