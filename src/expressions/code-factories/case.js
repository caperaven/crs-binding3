/**
 * @function caseFactory - parse the case expression and build a function that will evaluate the expression and return the result.
 *
 * NOTE: This is not loaded by default so to enable this feature you need to import this file.
 *
 * @param exp {string} - the expression to parse
 * @returns {Promise<Function>}
 *
 * @example <caption>case expression</caption>
 * "value < 10: 'yes', value < 20: 'ok', default: 'no'"
 *
 * if (value < 10) { ... }
 * else if (value < 20) { ... }
 * else {... }
 *
 * @example <caption>using caseFactory</caption>
 * let fn = await crs.binding.expression.caseFactory("value < 10: 'yes', value < 20: 'ok', default: 'no'");
 */
export async function caseFactory(exp, ctxName = "context") {
    const key = `${ctxName}:${exp}`;

    if (crs.binding.functions.has(key)) {
        const result = crs.binding.functions.get(key);
        result.count += 1;
        return result;
    }

    const code = [];
    const expo = await crs.binding.expression.sanitize(exp);
    exp = sanitizeArrays(expo.expression);

    const parts = exp.split(",");

    for (let part of parts) {
        const expParts = part.split(":").map(item => item.trim());

        if (expParts[0] == "context.default") {
            code.push(`return ${expParts[1]};`)
        }
        else {
            code.push(`if (${expParts[0]}) {`)
            code.push(`    return ${expParts[1]};`)
            code.push('}')
        }
    }

    const result = {
        key: key,
        function: new crs.classes.AsyncFunction(ctxName, code.join("\r").replaceAll("@", ",")),
        parameters: expo,
        count: 1
    };

    crs.binding.functions.set(key, result);
    return result;
}

/**
 * Check if the exp has an array syntax in it.
 * If there is a [ and ] replace all the commas between the quotes to ;
 * @param exp
 * @returns {*}
 */
function sanitizeArrays(exp) {
    if (exp.indexOf("[") == -1) {
        return exp;
    }

    const code = [];

    const parts = exp.split("[");
    for (const part of parts) {
        if (part.indexOf("]") == -1) {
            code.push(part);
            continue;
        }

        const subParts = part.split("]");
        const array = `[${subParts[0].replaceAll(",", "@")}] ${subParts[1]}`;
        code.push(array);
    }

    return code.join("");
}

crs.binding.expression.caseFactory = caseFactory;