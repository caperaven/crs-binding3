const providersMap = {
    "call"      : ".call",
    "emit"      : ".emit",
    "post"      : ".post",
    "process"   : ".process"
}

export default class KeyboardEventProvider {
    async onEvent(event, bid, intent) {
        const keyParts = intent.keys.split("_");

        for (const key of keyParts) {
           switch (key.toLowerCase()) {
                case "ctrl": {
                    if (!event.ctrlKey) return;
                }
                case "alt": {
                    if (!event.altKey) return;
                }
                case "shift": {
                    if (!event.shiftKey) return;
                }
                default: {
                    if (event.key.toLowerCase() != key.toLowerCase()) return;
                }
           }
        }

        const executeIntent = intent.value;
        const module = await crs.binding.providers.getAttrModule(executeIntent.provider);
        await module.onEvent(event, bid, executeIntent);
    }

    async parse(attr) {
        const name = attr.name;
        const value = attr.value;
        const nameParts = name.split(".");
        const event = nameParts[0];
        const keys = nameParts[1];
        const provider = nameParts[2];

        const module = await crs.binding.providers.getAttrModule(providersMap[provider]);
        const intentValue = await module.getIntent(value);

        const intentObj = {
            provider: "^(keydown|keyup)\\..+\\..*$",
            keys: keys,
            value: intentValue
        }

        const uuid = attr.ownerElement["__uuid"];

        crs.binding.eventStore.register(event, uuid, intentObj)
    }

    async clear(uuid) {
    }
}