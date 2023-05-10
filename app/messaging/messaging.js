import "./../../src/events/event-emitter.js";

export default class MessagingViewModel extends crs.classes.ViewBase {
    #myMessageHandler = this.#myMessage.bind(this);

    async load() {
        await crs.binding.events.emitter.on("my_event", this.#myMessageHandler);
        this.setProperty("contacts", { phone: 12345669 })
        await super.load();
    }

    async disconnectedCallback() {
        await crs.binding.events.emitter.remove("my_event", this.#myMessageHandler);
        await super.disconnectedCallback();
    }

    async #myMessage(event) {
        console.log(event);
    }
}