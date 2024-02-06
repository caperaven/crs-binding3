/**
 * @function ifFactory - Creates a function that evaluates an expression and returns the result.
 *
 * NOTE: This is not loaded by default so to enable this feature you need to import this file.
 *
 * @param exp {string} - the expression to parse
 * @returns {Promise<{function, count: number, parameters, key}>}
 *
 * @example <caption>if expression</caption>
 * "value < 10 ? 'yes' : 'no'"
 *
 * if (value < 10) { ... }
 * else { ... }
 *
 * @example <caption>using ifFactory</caption>
 * let fn = await crs.binding.expression.ifFactory("value < 10 ? 'yes' : 'no'");
 */
import {OptionalChainActions} from "../../utils/optional-chain-actions.js";

export async function ifFactory(exp, ctxName = "context") {
    const key = `${ctxName}:${exp}`;

    if (crs.binding.functions.has(key)) {
        const result = crs.binding.functions.get(key);
        result.count += 1;
        return result;
    }

    const code = [];

    const expo = await crs.binding.expression.sanitize(exp);
    exp = expo.expression.replaceAll("context.[", "[");

    if (!OptionalChainActions.hasTernary(exp)) {
        return setFunction(key, expo, `return ${exp}`, ctxName);
    }

    // const parts = exp.split(" ?").map(item => item.trim());
    const parts = OptionalChainActions.split(exp).map(item => item.trim());
    const left = parts[0];
    const right = parts[1];
    const rightParts = right?.split(":");

    code.push(`if (${left}) {`);
    code.push(`    return ${rightParts[0].trim()};`);
    code.push('}');

    if (rightParts.length > 1) {
        code.push("else {");
        code.push(`    return ${rightParts[1].trim()};`);
        code.push("}");
    }

    return setFunction(key, expo, code.join("\r"), ctxName);
}

function setFunction(key, exp, src, ctxName) {
    const result = {
        key: key,
        function: new crs.classes.AsyncFunction(ctxName, src),
        parameters: exp,
        count: 1
    };

    crs.binding.functions.set(key, result);
    return result;
}

crs.binding.expression.ifFactory = ifFactory;