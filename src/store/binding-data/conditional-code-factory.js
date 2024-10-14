import {processFieldConditionalDefaults} from "./process-conditional-default.js";
import {processValidations} from "./process-validations.js";

export async function processDefinition(bid, definition) {
    for (const fieldName of Object.keys(definition.fields)) {
        await processFieldConditionalDefaults(bid, fieldName, definition);
        await processValidations(bid, fieldName, definition);
    }
}