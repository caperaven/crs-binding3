class EventStore {
  #store = {};
  #eventHandler = this.#onEvent.bind(this);
  async #onEvent(event) {
    const target = event.composedPath()[0] || event.target;
    const uuid = target["__uuid"];
    if (uuid == null)
      return;
    const data = this.#store[event.type];
    const intent = data[uuid];
    if (intent != null) {
      const bid = target["__bid"];
      let provider = Array.isArray(intent) ? intent[0].provider : intent.provider;
      provider = provider.replaceAll("\\", "");
      const providerInstance = crs.binding.providers.attrProviders[provider];
      await providerInstance.onEvent(event, bid, intent, target);
    }
  }
  getIntent(event, uuid) {
    return this.#store[event]?.[uuid];
  }
  register(event, uuid, intent, isCollection = false) {
    if (this.#store[event] == null) {
      document.addEventListener(event, this.#eventHandler);
      this.#store[event] = {};
    }
    if (isCollection) {
      this.#store[event][uuid] ||= [];
      this.#store[event][uuid].push(intent);
      return;
    }
    this.#store[event][uuid] = intent;
  }
  clear(uuid) {
    const element = crs.binding.elements[uuid];
    if (element?.__events == null)
      return;
    const events = element.__events;
    for (const event of events) {
      delete this.#store[event][uuid];
    }
  }
}
export {
  EventStore
};
