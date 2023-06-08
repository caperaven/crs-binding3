export const person_def = {
    name: "person",
    fields: {
        firstName: {
            dataType: "string",
            default: "John",

            defaultValidations: {
                required: {
                    value: true
                },

                maxLength: {
                    error: "Too long",
                    value: 12
                }
            }
        },
        lastName: {
            dataType: "string",
            default: "Doe",

            conditionalDefaults: [
                {
                    conditionExpr: "person.firstName == 'Jane'",
                    value: "Smith"
                },
                {
                    conditionExpr: "person.firstName == 'Jane' && $context.isActive == true",
                    value: "Jones"
                }
            ],

            conditionalValidations: [
                {
                    conditionExpr: "person.firstName == 'Jane'",
                    rules: {
                        required: { value: true }
                    }
                }
            ]
        },
        age: {
            dataType: "number",
            default: 20,

            conditionalDefaults: [
                {
                    conditionExpr: "person.firstName == 'Jane' && person.lastName == 'Smith'",
                    value: 25
                }
            ]
        }
    }
};
