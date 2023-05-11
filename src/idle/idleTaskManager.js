import "./idleCallback.js";

export class IdleTaskManager {
    #list = [];

    constructor() {
        this.processing = false;
    }

    dispose() {
        this.#list = null;
    }

    async #processQueue() {
        this.processing = true;
        try {
            requestIdleCallback(async () => {
                while(this.#list.length > 0) {
                    const fn = this.#list.shift();

                    try {
                        await fn();
                    }
                    catch(e) {
                        console.error(e);
                    }
                }
            }, {timeout: 1000})
        }
        finally {
            this.processing = false;
        }
    }

    /**
     * Add a function to the manager to call once the system is idle
     * @param fn {Function}
     */
    async add(fn) {
        if (typeof fn != "function") return;

        // no support, just call the function
        if (requestIdleCallback == null) return await fn();

        // add callback to list for processing
        this.#list.push(fn);
        // if it is busy processing, don't do anything as the queue is already being processed.
        if (this.processing == true) return;

        // start processing
        await this.#processQueue();
    }
}