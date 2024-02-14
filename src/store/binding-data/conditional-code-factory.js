export async function processDefinition(bid, definition) {
    for (const fieldName of Object.keys(definition.fields)) {
        const field = definition.fields[fieldName];

        if (field.conditionalDefaults != null) {
            const code = [
                "let value = null;",
                "let wasSet = false;"
            ];
            const properties = [];

            const fieldPath = `${definition.name}.${fieldName}`;

            for (const condition of field.conditionalDefaults) {
                await processConditionDefault(bid, fieldPath, condition, code, properties);
            }

            code.push(`if (wasSet === true) {
                crs.binding.data.setProperty(${bid}, "${fieldPath}", value);
            }`)

            const triggerProperties = Array.from(new Set(properties));
            const fn = new Function("context", code.join("\n"));
            // definition.fields[fieldName].conditionalDefaultFn = new Function("context", code.join("\n"));
            // definition.fields[fieldName].conditionalProperties = triggerProperties;
            delete definition.fields[fieldName].conditionalDefaults;

            for (const property of triggerProperties) {
                await crs.binding.data.addCallback(bid, property, fn);
            }
        }
    }
}

async function processConditionDefault(bid, fieldPath, condition, code, properties) {
    const exp = await crs.binding.expression.sanitize(condition.conditionExpr);
    properties.push(...exp.properties);

    // 1. if we have a value we just do a standard if statement
    if (condition.hasOwnProperty("value")) {
        let value = condition.value
        if (typeof value === "string") {
            value = `"${value}"`;
        }

        code.push(`
            if (${exp.expression}) {
                value = ${value};
            }
        `.trim());

        code.push("wasSet = true;");
    }
    else {
        let trueValue = condition.true_value;
        let falseValue = condition.false_value;

        if (typeof trueValue === "string") {
            trueValue = `"${trueValue}"`;
        }

        if (typeof falseValue === "string") {
            falseValue = `"${falseValue}"`;
        }

        code.push(`value = ${exp.expression} ? ${trueValue} : ${falseValue};`);
        code.push("wasSet = true;");
    }
}