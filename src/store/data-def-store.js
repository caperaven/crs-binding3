import {ifFactory} from "../expressions/code-factories/if.js";

export class DataDefStore {
    /**
     * @field #store - The store of data definitions
     * @type {{}}
     */
    #store = {};

    /**
     * @field #valueAutomation - The store of value automation based on conditions
     * if the condition is true then the value is set to the value defined
     * @type {{condition, value}}
     */
    #valueAutomation = {};

    /**
     * @field #validationAutomation - The store of validation automation based on conditions
     * @type {{}}
     */
    #validationAutomation = {};

    /**
     * @field #automationMap - The map defines what automation to run when a particular field is changed
     * "if this field is changed, then update those fields that use it in a condition"
     * @type {{}}
     */
    #automationMap = {};

    get store() {
        return this.#store;
    }

    #addAutomationMap(bid, path, field, property) {
        let obj = this.#automationMap[bid];

        property = property.replace("$context.", "context.");

        obj[property] ||= new Set();
        obj[property].add(`${path}.${field}`);
    }

    async #parseDefinition(bid, def) {
        const path = def.name;

        for (const field of Object.keys(def.fields)) {
            const fieldDef = def.fields[field];

            await this.#parseConditionalDefaults(fieldDef, bid, path, field);
        }
    }

    async #parseConditionalDefaults(fieldDef, bid, path, field) {
        if (fieldDef.conditionalDefaults != null) {
            for (const conditionalDefault of fieldDef.conditionalDefaults) {
                // 1. sanitize the expression so we know what fields are affected
                const expo = await crs.binding.expression.sanitize(conditionalDefault.conditionExpr);

                for (let property of expo.properties) {
                    this.#addAutomationMap(bid, path, field, property);
                }

                const code = `
                    const context = crs.binding.data.getData(bid).data;
                    return ${expo.expression}
                    `;

                const fn = new crs.classes.AsyncFunction("bid", code);
                this.addAutomation(bid, path, field, fn, conditionalDefault.value, conditionalDefault.true_value, conditionalDefault.false_value);
            }
        }

        delete fieldDef.conditionalDefaults;
    }

    /**
     * @function register - Register a new data definition
     * @param name {string} - The name of the data definition
     * @param def {object} - The definition
     */
    async register(bid, def) {
        // make a copy of the definition so we can modify it
        def = JSON.parse(JSON.stringify(def));

        const nameParts = def.name.split(".");

        let store = this.#store[bid] ||= {};
        let valueAutomation = this.#valueAutomation[bid] ||= {};
        this.#automationMap[bid] ||= {};

        for (let i = 0; i < nameParts.length; i++) {
            if (i < nameParts.length - 1) {
                store = store[nameParts[i]] ||= {};
            }

            valueAutomation = valueAutomation[nameParts[i]] ||= {};
        }

        const name = nameParts[nameParts.length - 1];
        store[name] = def;

        await this.#parseDefinition(bid, def);
        delete def.name;
    }

    /**
     * @function unRegister - Unregister a data definition
     * @param name
     */
    async unRegister(bid) {
        delete this.#store[name];
        delete this.#valueAutomation[name];
        delete this.#automationMap[name];
    }

    addAutomation(bid, path, field, fn, value, trueValue, falseValue) {
        let obj = this.#valueAutomation[bid];

        for (const prop of path.split(".")) {
            obj = obj[prop];
        }

        const collection = obj[field] ||= [];
        const newItem = { condition: fn }

        if (value != null) {
            newItem.value = value;
        }

        if (trueValue != null) {
            newItem.trueValue = trueValue;
        }

        if (falseValue != null) {
            newItem.falseValue = falseValue;
        }

        collection.push(newItem);
    }

    removeAutomation(name, field) {
        delete this.#valueAutomation[name][field];
    }

    remove(bid) {
        delete this.#store[bid];
        delete this.#valueAutomation[bid];
        delete this.#automationMap[bid];
    }

    async automateValues(bid, fieldPath) {
        if (this.#automationMap[bid] == null) return;

        if (fieldPath.indexOf(".") == -1) {
            fieldPath = `context.${fieldPath}`;
        }

        const contextMap = this.#automationMap[bid][fieldPath];
        if (contextMap == null) return;

        // loop through all the fields that need to be updated
        for (const path of contextMap) {
            let definition = this.#valueAutomation[bid]
            const pathParts = path.split(".");

            for (const pathPart of pathParts) {
                definition = definition[pathPart];
            }

            // loop through conditions and set the value if the condition is true
            for (const item of definition) {
                const result = await item.condition(bid);
                const trueValue = item.value || item.trueValue;

                if (result == true) {
                    await crs.binding.data.setProperty(bid, path, trueValue);
                }
                else if (item.falseValue != null) {
                    await crs.binding.data.setProperty(bid, path, item.falseValue);
                }
            }
        }
    }

    /**
     * @function create - Create a new record
     * Set the property on the defined binding context based on the record def
     * @param bid {number} - The binding id
     * @param property {string} - The property name
     * @param name {string} - The name of the data definition
     */
    async create(bid, property) {
        let def = this.#store[bid];
        const pathParts = property.split(".");

        for (const pathPart of pathParts) {
            def = def[pathPart];
        }

        const model = {};
        for (const fieldName of Object.keys(def.fields)) {
            model[fieldName] = def.fields[fieldName].default || null;
        }

        await crs.binding.data.setProperty(bid, property, model);
    }

    /**
     * @function validate - Validate a record on a defined binding context and property based on the defined record def
     * @param bid {number} - The binding id
     * @param property {string} - The property name
     * @param name {string} - The name of the data definition
     */
    validate(bid, property, name) {

    }
}

crs.binding.dataDef = new DataDefStore();