import "../../expressions/code-factories/if.js";

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
export default class AttrIfProvider {
    async parse(attr, context) {
    }

    async update(uuid, ...properties) {
    }

}