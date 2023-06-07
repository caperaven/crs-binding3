export const model_def = {
    name: "model",
    fields: {
        status: {
            dataType: "string",
            default: "Active",

            conditionalDefaults: [
                {
                    conditionExpr: "person.firstName == 'Jane'",
                    true_value: "Inactive",
                    false_value: "Active"
                }
            ]
        }
    }
};
