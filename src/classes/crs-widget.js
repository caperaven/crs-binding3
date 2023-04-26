export class Widget extends HTMLElement {
    async disconnectedCallback() {
        this.#clearElements();
    }

    #clearElements() {
        this.dataset.ready = "false";

        for (let child of this.children) {
            crs.binding.utils.unmarkElement(child);
            child.remove();
        }
    }

    async onMessage(args) {
        // 1. release the current children
        this.#clearElements();

        // 2. get the context
        let context = args.context;
        if (typeof context != "object") {
            context = crs.binding.data.getContext(context);
        }

        // 3. set the HTML
        this.innerHTML = args.html || await fetch(args.url).then(response => response.text()).catch(err => console.error(err));

        // 4. parse the elements
        await crs.binding.parsers.parseElements(this.children, context, {});
        await crs.binding.data.updateContext(context.bid);
        this.dataset.ready = "true";
    }
}

customElements.define('crs-widget', Widget);