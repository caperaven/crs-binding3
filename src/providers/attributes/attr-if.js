import "../../expressions/code-factories/if.js";
import {AttrBase} from "./attr-base.js";

/**
 * @class AttrIfProvider
 * @description Conditional attribute provider that updates the attribute if a condition is met.
 *
 * @example <caption>only change if condition is met</caption>
 * <div data-value.if="value > 0 ? 'valid'">...</div>
 *
 * @example <caption>use a expression that also has a default fallback</caption>
 * <div data-value.if="value > 0 ? 'valid' : 'invalid'">...</div>
 *
 * @example <caption>change if condition is met, otherwise remove attribute</caption>
 * <div data-value.if="value > 0">...</div>
 */
export default class AttrIfProvider extends AttrBase {
    get providerKey() { return ".if"; }

    async parse(attr, context) {
        await super.parse(attr, context, async (value) => {
            return await crs.binding.expression.ifFactory(value);
        });
    }
}