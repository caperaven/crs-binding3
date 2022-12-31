class DomCollection {
    static append(uuid, item) {
        const element = crs.binding.elements[uuid];
        if (element == null) return;

        const details = crs.binding.inflation.store.get(uuid);

        const instance = details.template.content.cloneNode(true);
        details.fn(instance, item);
        element.appendChild(instance);
    }
}


crs.binding.dom ||= {};
crs.binding.dom.collection = DomCollection;