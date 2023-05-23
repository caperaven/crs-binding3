const providersMap = {
  "call": ".call",
  "emit": ".emit",
  "post": ".post",
  "process": ".process",
  "setvalue": ".setvalue"
};
class KeyboardEventProvider {
  async onEvent(event, bid, intent) {
    const keys = [];
    if (event.ctrlKey)
      keys.push("ctrl");
    if (event.altKey)
      keys.push("alt");
    if (event.shiftKey)
      keys.push("shift");
    keys.push(event.key.toLowerCase());
    const key = keys.join("_");
    intent = intent.find((i) => i.keys == key);
    if (!intent)
      return;
    const executeIntent = intent.value;
    const module = await crs.binding.providers.getAttrModule(executeIntent.provider);
    await module.onEvent(event, bid, executeIntent);
    event.preventDefault();
    event.stopPropagation();
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
      keys,
      value: intentValue
    };
    const uuid = attr.ownerElement["__uuid"];
    crs.binding.eventStore.register(event, uuid, intentObj, true);
    attr.ownerElement.removeAttribute(attr.name);
  }
  async clear(uuid) {
  }
}
export {
  KeyboardEventProvider as default
};
