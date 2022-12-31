import "./../utils/dom-collection-manager.js";

class ArrayProxyFunctions {
    static push(item) {
        this.push(item);

        const bid = this["__bid"];
        const property = this["__property"];
        if (bid == null || property == null) return;

        const uuids = crs.binding.data.getCallbacks(bid, property);
        for (const uuid of uuids) {
            crs.binding.dom.collection.append(uuid, item);
        }
    }
}

const arrayHandler = {
    get(target, prop, receiver) {
        if (ArrayProxyFunctions[prop]) {
            return ArrayProxyFunctions[prop].bind(target);
        }

        return target[prop];
    }
}

export default function wrapArrayForUpdate(array) {
    return new Proxy(array, arrayHandler);
}