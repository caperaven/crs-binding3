export const context_def = {
    name: "context",
    fields: {
        isActive2: {
            dataType: "boolean",
            default: true,

            conditionalDefaults: [
                {
                    conditionExpr: "person.firstName == 'Joe'",
                    value: false
                }
            ]
        }
    }
};
