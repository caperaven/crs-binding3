export class InflationManager {
    async register(id, template, ctxName = "context") {
        const fn = await crs.binding.expression.inflationFactory(template, ctxName);
        crs.binding.inflation.store.add(id, template, fn);
    }

    async unregister(id) {
        crs.binding.inflation.store.remove(id);
    }

    /**
     * @method get - For each record, create a instance of the template and call the function to inflate the template.
     * @param id {string} - The id of the template to inflate
     * @param data {Array} - The data to inflate the template with
     * @returns {Promise<void>}
     */
    async get(id, data, elements) {
        syncCollection(elements, data.length);

        const inflationDetails = crs.binding.inflation.store.get(id);

        for (let i = 0; i < data.length; i++) {
            const element = elements[i];
            inflationDetails.fn(element, data[i]);
        }

        return elements;
    }
}

function syncCollection(elements, count) {
    if (elements.length > count) {
        for (let i = elements.length - 1; i >= count; i--) {
            elements[i].remove();
        }
    }
    else if (elements.length < count) {
        for (let i = elements.length; i < count; i++) {
            elements.push(elements[0].cloneNode(true));
        }
    }
}

crs.binding.inflation.manager = new InflationManager();