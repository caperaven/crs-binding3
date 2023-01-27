/**
 * @class DomCollection - A class that manages the DOM collection as if it s an array.
 * Though this file is not loaded by default, it is imported by the array proxy.
 * This is used internally to update UI elements when an array is modified but can also be used externally.
 *
 * The methods match that of arrays, but the first parameter is the uuid of the element to update.
 */
class DomCollection {
    /**
     * @method append - Append items to the end of the collection.
     * @param uuid {string} - The uuid of the element to update.
     * @param items - The collection of items to append.
     */
    static append(uuid, ...items) {
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

    /**
     * @method splice - Remove and add items to the collection.
     * @param uuid {string} - The uuid of the element to update.
     * @param start {number} - The index to start at.
     * @param deleteCount {number} - The number of items to remove.
     * @param items - The collection of items to add.
     */
    static splice(uuid, start, deleteCount, ...items) {
        const element = crs.binding.elements[uuid];
        if (element == null) return;

        for (let i = start; i < start + deleteCount; i++) {
            if (i > element.children.length) {
                break;
            }

            if (element.children[i]) {
                element.removeChild(element.children[i]);
            }
        }

        const details = crs.binding.inflation.store.get(uuid);
        const fragment = document.createDocumentFragment();

        for (const item of items || []) {
            const instance = details.template.content.cloneNode(true);
            details.fn(instance, item);
            fragment.appendChild(instance);
        }

        const target = element.children[start];
        element.insertBefore(fragment, target);
    }

    /**
     * @method pop - Remove the last item from the collection.
     * @param uuid {string} - The uuid of the element to update.
     */
    static pop(uuid) {
        const element = crs.binding.elements[uuid];
        if (element == null) return;

        if (element.lastElementChild) {
            element.removeChild(element.lastElementChild);
        }
    }

    /**
     * @method shift - Remove the first item from the collection.
     * @param uuid {string} - The uuid of the element to update.
     */
    static shift(uuid) {
        const element = crs.binding.elements[uuid];
        if (element == null) return;

        if (element.firstElementChild) {
            element.removeChild(element.firstElementChild);
        }
    }
}

crs.binding.dom ||= {};
crs.binding.dom.collection = DomCollection;