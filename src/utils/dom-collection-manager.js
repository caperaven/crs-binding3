class DomCollection {
    static append(uuid, items) {
        const element = crs.binding.elements[uuid];
        if (element == null) return;

        const details = crs.binding.inflation.store.get(uuid);

        const fragment = document.createDocumentFragment();

        for (const item of items) {
            const instance = details.template.content.cloneNode(true);
            details.fn(instance, item);
            fragment.appendChild(instance);
        }

        element.appendChild(fragment);
    }
}


crs.binding.dom ||= {};
crs.binding.dom.collection = DomCollection;