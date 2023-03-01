/**
 * @class PerspectiveElement - This component allows you to swap between multiple views.
 * Use the view attribute to set the view to display.
 * Views are created using the template tag.  The data-id of the template tag is the name of the view.
 * When you swap views the old view is disposed.
 * The template content can contain binding expression as we parse the HTML when it is added to the DOM.
 *
 * - data-id="view-name" - This attribute is used to set the name of the view.
 * - data-default="true" - This attribute is used to set the default view.
 * - data-store="store-name" - This attribute is used to set the store name to use for the template.
 *
 * @property {string} view - The name of the view to display.
 * @property {string} ctx - The binding context to use for the view.
 * @property {boolean} hasOwnContext - If true, a context will be created for this element.
 * You can't set this from the outside as it is a read only property.
 * It is meant to be used when creating your own component based on this one.
 *
 * @example <caption>HTML example usage of perspective-element</caption>
 * <perspective-element>
 *   <template data-id="view1" data-default="true">
 *       <div>View 1</div>
 *   </template>
 *   <template data-id="view2">
 *       <div>View 2</div>
 *   </template>
 * </perspective-element>
 *
 */
export class PerspectiveElement extends HTMLElement {
    #view;
    #isLoading;
    #store;

    /**
     * @property {boolean} hasOwnContext - If true, a context will be created for this element.
     * @returns {boolean}
     */
    get hasOwnContext() {
        return true;
    }

    /**
     * @property {string} ctx - The binding context to use for the view.
     * @returns {*}
     */
    get ctx() {
        return this._dataId;
    }

    /**
     * @property {string} ctx - The binding context to use for the view.
     * @param newValue
     */
    set ctx(newValue) {
        this._dataId = newValue;

        if (newValue != null) {
            const name = this.getAttribute("name");

            if (name != null) {
                crs.binding.data.setName(this._dataId, name);
            }

            this.#loadView().catch(error => console.error(error));
        }
    }

    /**
     * @property {string} view - The name of the view to display.
     * @returns {*}
     */
    get view() {
        return this.#view;
    }

    /**
     * @property {string} view - The name of the view to display.
     * This will cause the swap out of the views, disposing the old and binding the new.
     * @param newValue
     */
    set view(newValue) {
        if (this.#view != newValue) {
            this.#view = newValue;
            this.#loadView().catch(error => console.error(error));
        }
    }

    /**
     * @constructor
     */
    constructor() {
        super();
        const contextAttribute = this.getAttribute("ctx.one-way") || this.getAttribute("ctx.once");

        if (this.hasOwnContext == true && contextAttribute == null) {
            this._dataId = crs.binding.data.addObject(this.constructor.name);
            crs.binding.data.addContext(this._dataId, this);
        }

        crs.binding.dom.enableEvents(this);
    }

    /**
     * @method dispose - This method is called when the element is removed from the DOM.
     */
    dispose() {
        crs.binding.dom.disableEvents(this);
        crs.binding.templates.remove(this.#store).catch(error => console.error(error))
    }

    /**
     * @method connectedCallback - This method is called when the element is added to the DOM.
     * @returns {Promise<void>}
     */
    async connectedCallback() {
        await this.#initialize();

        this.dataset.ready = "true";
        this.dispatchEvent(new CustomEvent("ready", {bubbles:false}));
    }

    async #initialize() {
        // 1. I am busy loading, if the context or view changes just stop it.
        this.#isLoading = true;
        this.#store = this.dataset.store || this.constructor.name;

        // 2. Load the HTML of this element as a store item in the store defined.
        this.#view = await crs.binding.templates.createStoreFromElement(this.#store, this);
        await this["preLoad"]?.();
        await this["load"]?.();

        this.#isLoading = false;
        await this.#loadView();
    }

    async disconnectedCallback() {
        this.dispose();
        crs.binding.utils.disposeProperties(this);
    }

    getProperty(property) {
        return crs.binding.data.getProperty(this, property);
    }

    setProperty(property, value, once = false) {
        crs.binding.data.setProperty(this, property, value);
    }

    async #loadView() {
        if (this.#isLoading == true) return;

        if (this.#view == null || this._dataId == null) {
            return;
        }

        this.innerHTML = "";

        const template = await crs.binding.templates.getStoreTemplate(this.#store, this.#view);
        this.appendChild(template);
        await crs.binding.parsers.parseElements(this.children, this._dataId, {folder: this.dataset.folder});

        requestAnimationFrame(() => {
            this.dataset.view = this.#view;
            this.dispatchEvent(new CustomEvent("view-loaded"));
        })
    }
}

customElements.define("perspective-element", PerspectiveElement);