import "./../../expressions/code-factories/inflation.js";

/**
 * @class TemplateRepeatForProvider - Generates a collection of elements based on a collection of data
 *
 * @example
 * <ul>
 *     <template for="person of people">
 *         <li>
 *             <span>${person.firstName} ${person.lastName}</span>
 *         </li>
 *     </template>
 * </ul>
 */
export default class TemplateRepeatForProvider {
    /**
     * @method parse - Parses the element and generates the collection of elements
     * @param element {HTMLTemplateElement} - The element to parse
     * @param context {BindingContext} - The context of the element
     * @returns {Promise<void>}
     */
    async parse(element, context) {
        const forExp = element.getAttribute("for");
        const forExpParts = forExp.split(" ");

        const uuid = crs.binding.utils.markElement(element.parentElement, context);
        element.parentElement["__path"] = forExpParts[2];
        element.parentElement["__repeat_container"] = true;
        element.parentElement.removeChild(element);
        element.innerHTML = cleanHtml(element.innerHTML);

        const fn = await crs.binding.expression.inflationFactory(element, forExpParts[0], false);
        crs.binding.inflation.store.add(uuid, element, fn);
        crs.binding.data.setCallback(uuid, context.bid, [forExpParts[2]], "template[for]");
    }

    /**
     * @method update - Updates the collection of elements
     * @param uuid {string} - The uuid of the element
     * @returns {Promise<void>}
     */
    async update(uuid) {
        const element = crs.binding.elements[uuid];
        const path = element["__path"];
        const data = crs.binding.data.getDataForElement(element);
        const collection = crs.binding.utils.getValueOnPath(data, path);

        if (collection == null) return;

        const storeItem = crs.binding.inflation.store.get(uuid);

        const fragment = document.createDocumentFragment();
        for (const item of collection) {
            const instance = storeItem.template.content.cloneNode(true).firstElementChild;
            storeItem.fn(instance, item);
            fragment.appendChild(instance);
        }

        element.innerHTML = "";
        element.appendChild(fragment);
    }
}

/**
 * When definign templates at times the string could look like this
 * "\n <li>${item.code}</li>\n "
 * We are cleaning it up so that we don't have all the additional noise causing text elements to be formed.
 * Thus we remove the element code and just return the clean html.
 * Everything from the first < to the last > is returned.
 * <li>${item.code}</li>
 * @param html
 * @returns {*|string}
 */
function cleanHtml(html) {
    const firstIndex = html.indexOf("<");
    const lastIndex = html.lastIndexOf(">");

    if (firstIndex !== -1 && lastIndex !== -1) {
        const cleanedString = html.substring(firstIndex, lastIndex + 1);
        return cleanedString;
    }

    return html;
}