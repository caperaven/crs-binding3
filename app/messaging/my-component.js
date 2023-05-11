class MessageTargetElement extends HTMLElement {
    onMessage(event) {
        console.log(event);
    }
}

customElements.define("message-target", MessageTargetElement);
