export function createRequiredRule(fieldName, definition, code) {
    code.push(`
        if ((${fieldName} || '').length > 0) {
            return true;
        }
    `)
}