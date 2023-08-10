/**
 * @class EventEmitter - A simple event emitter
 * There are two scenarios
 *
 * 1. Publish and subscribe to events using the on, emit, and remove functions.
 * 2. Push a message to an element using the postMessage function.
 *
 * This is not loaded by default in the crs binding, but can be loaded by importing this file.
 * Once registered you can use it like this:
 *
 * When using post message, the element must have an onMessage function.
 * You can limit the search to a specific scope by passing in a scope parameter.
 * The scope parameter is an element that will be used as the root of the querySelectorAll.
 * All elements that match the query will be sent the message.
 *
 * @example <caption>Register the event emitter</caption>
 * crs.binding.events.emitter.on('my-event', callback);
 *
 * @example <caption>Emit an event</caption>
 * crs.binding.events.emitter.emit('my-event', args);
 *
 * @example <caption>remove an event</caption>
 * crs.binding.events.emitter.remove('my-event', callback);
 *
 * @example <caption>Post a message to an element</caption>
 * crs.binding.events.emitter.postMessage('#myElement', objToSend);
 *
 */
export class EventEmitter {
    #events = {};

    /**
     * @property events - The events that are registered.
     * @returns {{}}
     */
    get events() {
        return this.#events;
    }

    /**
     * @function on - This registers an event. If the event and callback pair is already registered, it will not be registered again.
     * @param event {string} - The event name to register.
     * @param callback {Function} - The callback to register.
     * @returns {Promise<void>}
     */
    async on(event, callback) {
        let events = this.#events[event] ||= [];

        if (events.indexOf(callback) == -1) {
            events.push(callback);
        }
    }

    /**
     * @function emit - This emits an event.
     * If there is only one callback registered, it will return the result of the callback.
     * @param event {string} - The event name to emit.
     * @param args {Object} - The arguments to pass to the callback.
     * @returns {Promise<*>}
     */
    async emit(event, args) {
        if (this.#events[event]) {
            const events = this.#events[event];

            if (events.length == 1) {
                return await events[0](args);
            }
            else {
                for (let e of events) {
                    await e(args);
                }
            }
        }
    }

    /**
     * @function remove - This removes an event.
     * @param event {string} - The event name to remove.
     * @param callback {Function} - The callback to remove.
     * @returns {Promise<void>}
     */
    async remove(event, callback) {
        if (this.#events[event]) {
            const events = this.#events[event];
            const index = events.indexOf(callback);
            if (index != -1) {
                events.splice(index, 1);
            }
            if (events.length === 0) {
                delete this.#events[event];
            } 
        }
    }

    /**
     * @function postMessage - This posts a message to an element. The element must have an onMessage function.
     * @param query {string} - The query to use to find the element.
     * @param args {Object} - The arguments to pass to the onMessage function.
     * @param scope {Element} - The scope to use for the querySelectorAll.
     * @returns {Promise<void>}
     */
    async postMessage(query, args, scope) {
        const element = scope || document;
        const documentElements = Array.from(element.querySelectorAll(query));
        const queryableElements = crs.binding.queryable.query(query);

        const items = new Set([...documentElements, ...queryableElements]);

        const promises = [];

        for (let item of items) {
            promises.push(item.onMessage.call(item, args));
        }

        await Promise.all(promises);
    }
}

/**
 * Register the event emitter on the binding engine for use.
 * @type {EventEmitter}
 */
(crs.binding.events ||= {}).emitter = new EventEmitter();
