/**
 * @function ifFactory - Creates a function that evaluates an expression and returns the result.
 *
 * NOTE: This is not loaded by default so to enable this feature you need to import this file.
 *
 * @param exp {string} - the expression to parse
 * @returns {Promise<Function>}
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
export async function ifFactory(exp) {
    const code = [];
    exp = (await crs.binding.expression.sanitize(exp)).expression.replaceAll("context.[", "[");

    if (exp.indexOf("?") == -1) {
        return new Function("context", `return ${exp}`);
    }

    const parts = exp.split("?").map(item => item.trim());
    const left = parts[0];
    const right = parts[1];
    const rightParts = right.split(":");

    code.push(`if (${left}) {`);
    code.push(`    return ${rightParts[0].trim()};`);
    code.push('}');

    if (rightParts.length > 1) {
        code.push("else {");
        code.push(`    return ${rightParts[1].trim()};`);
        code.push("}");
    }

    return new Function("context", code.join("\n"));
}

crs.binding.expression.ifFactory = ifFactory;