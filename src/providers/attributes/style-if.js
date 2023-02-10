import "../../expressions/code-factories/if.js";
import {StyleBase} from "./style-base.js";

/**
 * @class StyleIfProvider
 * @description Set an element style based on an if expression.
 *
 * @example <caption>if expression</caption>
 * <div style.background.if="isActive == true ? 'blue'"></div>
 *
 * @example <caption>if expression with a default</caption>
 * <div style.background.if="isActive == true ? 'blue' : 'red'"></div>
 */
export default class StyleIfProvider extends StyleBase {
    async parse(attr, context) {
        await super.parse(attr, context, async (value) => {
            return await crs.binding.expression.ifFactory(value);
        });
    }
}