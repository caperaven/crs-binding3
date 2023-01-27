/**
 * @class BindableElement
 * @extends HTMLElement
 * @description Base class for all custom elements
 */
export class BindableElement extends HTMLElement {
    #bid;

    /**
     * @property {boolean} shadowDom - If true the element will use shadow dom.
     * @returns {boolean}
     */
    get shadowDom() {
        return false;
    }

    /**
     * @property {boolean} hasOwnContext - If true the element will have its own binding context.
     * @returns {boolean}
     */
    get hasOwnContext() {
        return true;
    }

    /**
     * @property {number} - The binding context id.
     * @returns {*}
     */
    get bid() {
        return this.#bid;
    }

    /**
     * @constructor
     */
    constructor() {
        super();

        if (this.shadowDom == true) {
            this.attachShadow({ mode: "open" });
        }

        if (this.hasOwnContext == true) {
            this.#bid = crs.binding.data.addObject(this.constructor.name);
            crs.binding.data.addContext(this.#bid, this);
        }

        crs.binding.dom.enableEvents(this);
    }

    /**
     * @method dispose - Dispose of the element and free up memory.
     */
    dispose() {
        crs.binding.dom.disableEvents(this);
        crs.binding.utils.disposeProperties(this);
    }

    /**
     * @method connectedCallback - Called when the element is added to the DOM.
     * @returns {Promise<void>}
     */
    async connectedCallback() {
        await this.preLoad?.();

        await loadHtml(this);
        await load(this);
        await setName(this);

        this.dataset.ready = "true";
        this.dispatchEvent(new CustomEvent("ready", {bubbles:false}));
    }

    /**
     * @method disconnectedCallback - Called when the element is removed from the DOM.
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        this.dispose();
        crs.binding.utils.unmarkElement(this);
        crs.binding.utils.disposeProperties(this);

        await crs.binding.templates.remove(this.constructor.name);
        await crs.binding.data.remove(this.#bid);
    }

    /**
     * @method getProperty - Get a property from the binding context.
     * @param property {string} - The property name to get.
     * @returns {*}
     */
    getProperty(property) {
        return crs.binding.data.getProperty(this, property);
    }

    /**
     * @method setProperty - Set a property on the binding context.
     * @param property {string} - The property name to set.
     * @param value {*} - The value to set.
     */
    setProperty(property, value) {
        crs.binding.data.setProperty(this, property, value);
    }
}

/**
 * @method getHtmlPath - If mobi is set and the user agent is a mobile device return the mobi path.
 * Otherwise, return the html path.
 * @param obj {BindableElement} - The object to get the path from.
 * @returns {*}
 */
function getHtmlPath(obj) {
    const mobiPath = obj.mobi;
    if (mobiPath != null && /Mobi/.test(navigator.userAgent)) {
        return mobiPath;
    }

    return obj.html;
}

/**
 * @method setName - Set the name of the element on the binding context.
 * This just helps when debugging and looking at the binding context data.
 * @param component {BindableElement} - The component to set the name on.
 * @returns {Promise<void>}
 */
async function setName(component) {
    requestAnimationFrame(() => {
        const name = component.getAttribute("id");

        if (name != null) {
            crs.binding.data.setName(component.bid, name);
        }
    });
}

/**
 * @method load - Call the load method on the component if it exists.
 * @param component {BindableElement} - The component to load.
 * @returns {Promise<void>}
 */
async function load(component) {
    if (component.load != null) {
        await component.load.call(component);
    }
}

/**
 * @method loadHtml - Load the html for the component.
 * If the component has a shadow root the html will be added to the shadow root.
 * Otherwise, the html will be added to the element.
 * @param component {BindableElement} - The component to load the html for.
 * @returns {Promise<void>}
 */
async function loadHtml(component) {
    if (component.html == null) return;

    const html = await crs.binding.templates.get(component.constructor.name, getHtmlPath(component));

    if (component.shadowRoot != null) {
        component.shadowRoot.innerHTML = html;
    }
    else {
        component.innerHTML = html;
    }

    await crs.binding.parsers.parseElements(component.shadowRoot ? component.shadowRoot.children : component.children, component);
}

crs.classes.BindableElement = BindableElement;