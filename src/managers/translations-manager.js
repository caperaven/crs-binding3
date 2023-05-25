/**
 * @class TranslationsManager
 * @description Manage a dictionary of translations
 *
 * features:
 * - add translations to the dictionary
 * - delete translations from the dictionary
 * - get a translation from the dictionary
 * - get a translation from the dictionary and replace any markup
 * - parse an element and replace any translations
 * - parse an attribute and replace any translations
 *
 * Translations are defined as objects where the property path is the key and the value is the translation.
 * If you have a temporary context you can add the translations to that context and then delete the context.
 * This context is defined during the add call and used again to delete the translations.
 */
export class TranslationsManager {
    #dictionary = {};

    /**
     * @method add - Add translations to the dictionary
     * @param obj {object} - The translations to add to the dictionary
     * @param context {string} - The context to add the translations to
     * @returns {Promise<void>}
     */
    async add(obj, context) {
        flattenPropertyPath(context || "", obj, this.#dictionary);
    }

    /**
     * @method delete - Delete translations from the dictionary
     * @param context {string} - The context to delete the translations from
     * @returns {Promise<void>}
     */
    async delete(context) {
        const filterKey = `${context}.`;
        const keys = Object.keys(this.#dictionary).filter(item => item.indexOf(filterKey) === 0);
        for (let key of keys) {
            delete this.#dictionary[key];
        }
    }

    /**
     * @method get - Get a translation from the dictionary
     * @param element {string} - The key to get the translation for
     * @returns {Promise<void>}
     */
    async parseElement(element) {
        if (element.children.length == 0 && element.textContent.indexOf("&{") != -1) {
            element.textContent = await this.get_with_markup(element.textContent.trim());
        }

        for (let attribute of element.attributes || []) {
            await this.parseAttribute(attribute);
        }

        for (let child of element.children || []) {
            await this.parseElement(child);
        }
    }

    /**
     * @method parseAttribute - Parse an attribute and replace any translations
     * @param attribute {string} - The attribute to parse
     * @returns {Promise<void>}
     */
    async parseAttribute(attribute) {
        if (attribute.value.indexOf("&{") !== -1) {
            attribute.value = await this.get_with_markup(attribute.value);
        }
    }

    /**
     * @method get - Get a translation from the dictionary
     * @param key {string} - The key to get the translation for
     * @returns {Promise<*>}
     */
    async get(key) {
        let result = this.#dictionary[key];

        if(result != null) {
            return result;
        }

        result = this.fetch == null ? null : await this.fetch(key);
        if (result != null) {
            this.#dictionary[key] = result;
        }

        return result;
    }

    /**
     * @method get_with_markup - Get a translation from the dictionary and replace any markup
     * @param key {string} - The key to get the translation for
     * @returns {Promise<*>}
     */
    async get_with_markup(key) {
        key = key.split("&{").join("").split("}").join("");
        return await this.get(key);
    }
}

/**
 * @function flattenPropertyPath
 * @description Flatten a property path into a single object
 * @param prefix
 * @param obj
 * @param target
 */
function flattenPropertyPath(prefix, obj, target) {
    if (typeof obj === "string") {
        if (prefix[0] === ".") {
            prefix = prefix.substring(1);
        }
        target[prefix] = obj;
    }
    else {
        const keys = Object.keys(obj);
        for (let key of keys) {
            flattenPropertyPath(`${prefix}.${key}`, obj[key], target);
        }
    }
}