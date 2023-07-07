/**
 * @class Observable - A class that can be observed by other classes using the observer pattern.
 * It works the same way as an Element with the addEventListener and removeEventListener methods.
 *
 * @example
 * const instance = new MyObservable();
 * instance.addEventListener("myEvent", (event) => {...});
 * instance.removeEventListener("myEvent", (event) => {...});
 * instance.dispose();
 */
export class Observable {
    #events = [];
    #eventEmitter = new EventTarget();

    #allowNotifications = true;

    get allowNotifications() {
        return this.#allowNotifications;
    }

    set allowNotifications(newValue) {
        this.#allowNotifications = newValue;
    }

    /**
     * @property events - The events that are currently being listened to.
     * @returns {*[]}
     */
    get events() {
        return Object.freeze(this.#events);
    }

    /**
     * @method dispose - Remove all event listeners and clear the events array.
     */
    dispose() {
        for (const {event, listener} of this.#events) {
            this.#eventEmitter.removeEventListener(event, listener);
        }
        this.#events.length = 0;
    }

    /**
     * @method addEventListener - Add an callback that will be called when the event is triggered.
     * @param event {string} - The event to listen to.
     * @param listener {function} - The callback to call when the event is triggered.
     */
    addEventListener(event, listener) {
        this.#eventEmitter.addEventListener(event, listener);
        this.#events.push({event, listener});
    }

    /**
     * @method removeEventListener - Remove a callback from the event listener.
     * @param event {string} - The event to remove the callback from.
     * @param listener {function} - The callback to remove.
     */
    removeEventListener(event, listener) {
        this.#eventEmitter.removeEventListener(event, listener);
        this.#events.splice(this.#events.indexOf({event, listener}), 1);
    }

    /**
     * @method notify - Trigger an event with the specified detail.
     * This is meant for internal use only but can also help with testing.
     * @param event {string} - The event to trigger.
     * @param detail {*} - The detail to pass to the event.
     */
    notify(event, detail) {
        if (this.allowNotifications === true) {
            this.#eventEmitter.dispatchEvent(new CustomEvent(event, { detail }));
        }
    }
}

crs.classes.Observable = Observable;