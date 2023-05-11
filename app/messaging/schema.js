export const schema = {
    "id": 'test_schema',

    "main": {
        "parameters_def": {
            message: { type: "string", required: true }
        },

        "steps": {
            "start": {
                "type": "console",
                "action": "log",
                "args": {
                    "message": "$parameters.message"
                }
            }
        }
    }
}