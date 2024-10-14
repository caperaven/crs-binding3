import {createRequiredRule} from './required-rule-factory.js';

export async function processValidations(bid, fieldName, definition) {
    const field = definition.fields[fieldName];
    const code = []
    if (field.defaultValidations != null || field.conditionalValidations != null) {
        await processConditionalValidations(bid, fieldName, definition, code);
        await processDefaultValidations(bid, fieldName, definition, code);
    }

    code.push("return false;");

    const src = code.join("\n");
    console.log(src);
}

async function processConditionalValidations(bid, fieldName, definition, code) {
    const field = definition.fields[fieldName];
    if (field.conditionalValidations == null) return;

    const fieldPath = `${definition.name}.${fieldName}`;

    for (const conditionalValidation of field.conditionalValidations) {
        const conditionExpr = conditionalValidation.conditionExpr;
        const rules = conditionalValidation.rules;

        const exp = await crs.binding.expression.sanitize(conditionExpr);

        code.push(`if (${exp.expression}) {`);
        await processRules(bid, rules, fieldPath, definition, code)
        code.push(`}`);
    }
}

async function processDefaultValidations(bid, fieldName, definition, code) {
    const field = definition.fields[fieldName];
    if (field.defaultValidations == null) return;

    const fieldPath = `${definition.name}.${fieldName}`;
    const rules = field.defaultValidations;

    await processRules(bid, rules, fieldPath, definition, code)
}

async function processRules(bid, rules, fieldPath, definition, code) {
    const keys = Object.keys(rules);
    fieldPath = `context.${fieldPath}`;

    for (const key of keys) {
        const def = rules[key];

        switch(key) {
            case "required": {
                createRequiredRule(fieldPath, def, code)
                break;
            }
        }
    }
}