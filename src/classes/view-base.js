/**
 * @class ViewBase - Base class for all views in the application.
 * It works much in the same way as the BindableElement class.
 */
export class ViewBase {
    #element;
    #bid

    /**
     * @property {string} html - The html file to load.
     * @returns {string}
     */
    get title() {
        return this.getProperty("title");
    }

    /**
     * @property {string} title - Set the title of the view.
     * @param newValue {string} - The new title value to set.
     */
    set title(newValue) {
        this.setProperty("title", newValue);
    }

    /**
     * @property {number} bid - The binding context id of the view.
     * @returns {number}
     */
    get bid() {
        return this.#bid;
    }

    /**
     * @property {HTMLElement} element - The element that the view is bound to.
     * @returns {HTMLElement}
     */
    get element() {
        return this.#element;
    }

    /**
     * @property {HTMLElement} element - Set the element that the view is bound to.
     * @param newValue {HTMLElement} - The new element to bind to.
     */
    set element(newValue) {
        this.#element = newValue;
        this.#element.dataset.ready = "false";
        this.#element["__bid"] = this.#bid;
    }

    /**
     * @constructor
     */
    constructor() {
        this.#bid = crs.binding.data.addObject(this.constructor.name);
        crs.binding.data.addContext(this.#bid, this);
    }

    /**
     * @method connectedCallback - Called when the element is added to the DOM.
     * @returns {Promise<unknown>}
     */
    async connectedCallback() {
        return new Promise(async resolve => {
            if(this["preLoad"] != null) {
                await this["preLoad"]();
            }

            const path = crs.binding.utils.getPathOfFile(this.html);

            requestAnimationFrame(async () => {
                await crs.binding.parsers.parseElements(this.element.children, this, path ? {folder: path} : null);
                await this.load();
            })

            resolve();
        })
    }

    /**
     * @method disconnectedCallback - Called when the element is removed from the DOM.
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        await crs.binding.data.remove(this.#bid);
        crs.binding.utils.unmarkElement(this.#element);
        this.#element = null;
    }

    /**
     * @method getProperty - Get a property from the binding context.
     * @param property {string} - The property name to get.
     * @param convert {boolean} - Whether to convert the value if there is a value converter.
     * @returns {*}
     */
    getProperty(property, convert = true) {
        return crs.binding.data.getProperty(this, property, convert);
    }

    /**
     * @method setProperty - Set a property on the binding context.
     * @param property {string} - The property name to set.
     * @param value {*} - The value to set.
     * @param convert {boolean} - Whether to convert the value if there is a value converter.
     */
    setProperty(property, value, convert = true) {
        crs.binding.data.setProperty(this, property, value, convert);
    }

    /**
     * @method load - Called when the view is loaded.
     * You can override this method to add any of your own load logic.
     * @returns {Promise<void>}
     */
    async load() {
        this.#element.style.visibility = "";
        this.#element.dataset.ready = "true";
    }
}

crs.classes.ViewBase = ViewBase;