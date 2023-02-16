import "../../expressions/code-factories/case.js";
import {AttrBase} from "./attr-base.js";

/**
 * @class AttrCaseProvider - Provider that deals with the .case attribute. It is used to create a switch statement.
 *
 * @example
 * <div data-value.case="age <= 10: 'red', age <= 20: 'blue', default: 'green'" class="attr">Attr: </div>
 */
export default class AttrCaseProvider extends AttrBase {
    get providerKey() { return ".case"; }

    async parse(attr, context) {
        await super.parse(attr, context, async (value) => {
            return await crs.binding.expression.caseFactory(value);
        });
    }
}