/**
 * @function - compiles an binding expression into a function that can be executed
 *
 * NOTE: used internally only
 *
 * @param exp - the expression to compile
 * @param parameters - the parameters to pass to the function
 * @param options - the options to use when compiling the expression
 * @returns {Promise<Object>}
 *
 */
export async function compile(exp, parameters, options) {
    const ctxName = options?.ctxName || "context";
    const key = `${ctxName}:${exp}`;

    // 1. has the expression been cached before and if so use that
    if (crs.binding.functions.has(key)) {
        const result = crs.binding.functions.get(key);
        result.count += 1;
        return result;
    }


    parameters = parameters || [];
    const sanitize = options?.sanitize ?? true;

    let san;
    let src = exp;

    // 2. sanitize the expression if required
    if (sanitize == true) {
        san = await crs.binding.expression.sanitize(exp, ctxName);

        san.expression = san.expression.split(".").join("?.").split("}").join(" || ''}");

        src = san.isLiteral === true ?
            ["return `", san.expression, "`"].join("") :
            ["return ", san.expression].join("");
    }
    else {
        san = {
            expression: exp
        }
    }

    // 3. compile a function for the src generated
    const result = {
        key: key,
        function: new crs.classes.AsyncFunction(ctxName, ...parameters, src),
        parameters: san,
        count: 1
    };

    crs.binding.functions.set(key, result);

    return result;
}

export function release(exp) {
    if (exp == null || typeof exp != "object") return;
    
    const key = exp.key;
    if (crs.binding.functions.has(key)) {
        const x = crs.binding.functions.get(key);
        x.count -= 1;

        if (x.count == 0) {
            crs.binding.utils.disposeProperties(x);
            crs.binding.functions.delete(key);
        }
    }
}
