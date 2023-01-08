export class IndexViewModel extends crs.classes.ViewBase {
    constructor() {
        super();
        this.element = document.body;
    }

    async preLoad() {
        const menu = await fetch("/app/routes.json").then(result => result.json());
        this.setProperty("menu", menu.routes);
    }
}

globalThis.viewModel = new IndexViewModel();
requestAnimationFrame(() => {
    globalThis.viewModel.connectedCallback();
})