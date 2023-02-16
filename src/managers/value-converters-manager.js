/**
 * @class ValueConvertersManager - Manages value converters
 *
 * Features:
 * - add - Add a converter
 * - get - Get a converter based on key
 * - remove - Remove converter
 * - convert - Use the converter defined by key and convert the value using either get or set as defined by direction
 */
export class ValueConvertersManager {
    constructor() {
        this._converters = new Map();
    }

    /**
     * @method add - Add a converter
     * @param key {string} converter key used to identify the converter
     * @param converter {object} converter object with get and set methods
     */
    add(key, converter) {
        this._converters.set(key, converter);
    }

    /**
     * @method get - Get a converter based on key
     * @param key {string} - converter key
     * @returns {Object} - converter object
     */
    get(key) {
        return this._converters.get(key);
    }

    /**
     * @method remove - Remove converter
     * @param key {string} - converter key
     */
    remove(key) {
        this._converters.delete(key);
    }

    /**
     * @method convert - Use the converter defined by key and convert the value using either get or set as defined by direction
     * @param value {any} value to convert
     * @param key {string} converter key
     * @param direction {string} get || set
     */
    convert(value, key, direction, args) {
        const converter = this._converters.get(key);
        if (converter == null) return null;
        return converter[direction](value, args);
    }
}

crs.binding.valueConvertersManager = new ValueConvertersManager()