export const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

export function compile(exp, parameters, options) {
    parameters = parameters || [];
    let sanitize = true;
    let async = false;
    let ctxName = "context";

    if (options != null) {
        if (options.sanitize != null) sanitize = options.sanitize;
        if (options.async != null) async = options.async;
        if (options.ctxName != null) ctxName = options.ctxName;
    }

    if (crs.binding.functions.has(exp)) {
        const x = crs.binding.functions.get(exp);
        x.count += 1;
        return x;
    }

    let src = exp;
    let san;

    if (sanitize == true) {
        san = crs.binding.expression.sanitize(exp, ctxName);

        if (crs.binding.functions.has(san.expression)) {
            const x = crs.binding.functions.get(san.expression);
            x.count += 1;
            return x;
        }

        src = san.isLiteral === true ? ["return `", san.expression, "`"].join("") : `return ${san.expression}`;

        const parts = san.expression.split(".");
        if (parts.length > 2) {
            src = `try { ${src} } catch(error) { return null }`;
        }
    }
    else {
        san = {
            expression: exp
        }
    }

    const fn = async == true ? new AsyncFunction(ctxName, ...parameters, src) : new Function(ctxName, ...parameters, src);

    const result = {
        function: fn,
        parameters: san,
        count: 1
    };

    crs.binding.functions.set(san.expression, result);

    return result;
}

export function release(exp) {
    if (exp == null || typeof exp != "object") return;
    
    const key = exp.parameters.expression;
    if (crs.binding.functions.has(key)) {
        const x = crs.binding.functions.get(key);
        x.count -= 1;

        if (x.count == 0) {
            crs.binding.utils.disposeProperties(x);
            crs.binding.functions.delete(key);
        }
    }
}
