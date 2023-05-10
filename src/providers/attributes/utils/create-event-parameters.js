export function createEventParameters(event, exp) {
    const args = {};

    const params = exp.split(",");
    for (const param of params) {
        const parameter = param.trim();

        switch (parameter) {
            case "$event": {
                args["event"] = parameter;
                break;
            }
            case "$context": {
                args["context"] = parameter;
                break;
            }
            default: {
                const parts = parameter.split("=");
                args[parts[0].trim()] = parts[1].trim().replaceAll("'", "");
                break;
            }
        }
    }

    return { event, args };
}