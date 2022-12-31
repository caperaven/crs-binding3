class DomCollection {
    static append(uuid, item, template, inflationFn) {
        const element = crs.binding.elements[uuid];
        if (element == null) return;
    }
}


crs.binding.dom ||= {};
crs.binding.dom.collection = DomCollection;