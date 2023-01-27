import "../../expressions/code-factories/if.js";

/**
 * Set an element style based on an if expression.
 *
 * @example <caption>if expression</caption>
 * <div style.background.if="isActive == true ? 'blue'"></div>
 *
 * @example <caption>if expression with a default</caption>
 * <div style.background.if="isActive == true ? 'blue' : 'red'"></div>
 */
export default class StyleIfProvider {
    async parse(attr, context) {
    }

    async update(uuid, ...properties) {
    }
}