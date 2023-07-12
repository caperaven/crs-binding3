class TimingComponent extends HTMLElement {
    #something;

    get something() {
        return this.#something;
    }

    set something(value) {
        this.#something = value;
        console.log(this.#something);
    }

    constructor() {
        super();
        console.log("contructor");
        this.attachShadow({ mode: "open" });
    }
    async connectedCallback() {
        console.log("connected callback");
        await this.load();
    }

    load() {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                const timeout = setTimeout(async () => {
                    console.log("loading html");
                    this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
                    this.dataset.ready = "true";
                    this.dispatchEvent(new CustomEvent("ready", {bubbles:false}));
                    console.log("we are ready");
                    clearTimeout(timeout);
                    resolve();
                }, 2000);
            })
        })
    }
}

customElements.define("timing-component", TimingComponent);