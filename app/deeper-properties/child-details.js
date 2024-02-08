export class ChildDetails extends HTMLElement {
    #child;

    get child() {
        return this.#child;
    }
    set child(newValue) {
        this.#child = newValue;
        if(newValue != null) {
            this.innerHTML = "";
            const element = document.createElement("h1");
            element.textContent = `${newValue.firstName} ${newValue.lastName}`;
            this.appendChild(element)
        }
    }
}

customElements.define("child-details", ChildDetails);