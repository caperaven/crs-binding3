export async function caseFactory(exp) {
    const code = [];
    exp = await crs.binding.expression.sanitize(exp).expression;

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

    return new Function("context", code.join("\n"));
}

crs.binding.expression.caseFactory = caseFactory;