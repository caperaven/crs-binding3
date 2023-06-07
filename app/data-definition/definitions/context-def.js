export const context_def = {
    name: "context",
    fields: {
        isActive: {
            dataType: "boolean",
            default: true,

            conditionalDefaults: [
                {
                    conditionExpr: "person.firstName == 'Jane'",
                    value: false
                }
            ]
        }
    }
};
