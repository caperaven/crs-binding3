import "./../validation/validation-ui.js";

/**
 * This class allows you to define data definitions that manage things like:
 * 1. Default values
 * 2. Conditional default values
 * 3. Conditional validations
 *
 * See the data-definition app page for an example of how to use this class
 */

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
     * @field #defaultAutomationMap - The map defines what automation to run when a particular field is changed
     * "if this field is changed, then update those fields that use it in a condition"
     * @type {{}}
     */
    #defaultAutomationMap = {};

    /**
     * @field #validationAutomationMap - The map defines what validation to run when a particular field is changed
     * These validations update the UI accordingly
     * @type {{}}
     */
    #validationAutomationMap = {};

    get store() {
        return this.#store;
    }

    #addAutomationMap(map, bid, path, field, property) {
        let obj = map[bid];

        property = property.replace("$context.", "context.");

        obj[property] ||= new Set();
        obj[property].add(`${path}.${field}`);
    }

    async #parseDefinition(bid, def) {
        const path = def.name;

        for (const field of Object.keys(def.fields)) {
            const fieldDef = def.fields[field];

            await this.#parseConditionalDefaults(fieldDef, bid, path, field);
            await this.#parseConditionalValidations(fieldDef, bid, path, field);
        }
    }

    async #parseConditionalDefaults(fieldDef, bid, path, field) {
        if (fieldDef.conditionalDefaults != null) {
            for (const conditionalDefault of fieldDef.conditionalDefaults) {
                // 1. sanitize the expression so we know what fields are affected
                const expo = await crs.binding.expression.sanitize(conditionalDefault.conditionExpr);

                for (let property of expo.properties) {
                    this.#addAutomationMap(this.#defaultAutomationMap, bid, path, field, property);
                }

                const code = `
                    const context = crs.binding.data.getData(bid).data;
                    return ${expo.expression}
                    `;

                const fn = new crs.classes.AsyncFunction("bid", code);
                this.addDefaultsAutomation(bid, path, field, fn, conditionalDefault.value, conditionalDefault.true_value, conditionalDefault.false_value);
            }
        }

        delete fieldDef.conditionalDefaults;
    }

    async #parseDefaultValidations(fieldDef, bid, path, field) {
        if (fieldDef.defaultValidations != null) {
            for (const key of Object.keys(fieldDef.defaultValidations)) {
                const rule = key;
                const def = fieldDef.defaultValidations[key];
                const fieldPath = `${path}.${field}`.replace("context.", "");
                crs.binding.ui.apply(bid, fieldPath, rule, def);
            }
        }

        delete fieldDef.defaultValidations;
    }

    async #parseConditionalValidations(fieldDef, bid, path, field) {
        if (fieldDef.conditionalValidations != null) {
            for (const conditionalValidation of fieldDef.conditionalValidations) {
                // 1. sanitize the expression so we know what fields are affected
                const expo = await crs.binding.expression.sanitize(conditionalValidation.conditionExpr);

                for (let property of expo.properties) {
                    this.#addAutomationMap(this.#validationAutomationMap, bid, path, field, property);
                }

                const code = `
                    const context = crs.binding.data.getData(bid).data;
                    return ${expo.expression}
                    `;

                const fn = new crs.classes.AsyncFunction("bid", code);
                const def = [];
                for (const rule of Object.keys(conditionalValidation.rules)) {
                    const validationRule = conditionalValidation.rules[rule];
                    const value = validationRule.value;
                    const required = validationRule.required || true;
                    def.push({ rule, value, required });
                }

                this.addValidationAutomation(bid, path, field, fn, def);
            }
        }

        delete fieldDef.conditionalValidations;
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
        this.#defaultAutomationMap[bid] ||= {};
        this.#validationAutomationMap[bid] ||= {};
        this.#validationAutomation[bid] ||= {};

        for (let i = 0; i < nameParts.length; i++) {
            if (i < nameParts.length - 1) {
                store = store[nameParts[i]] ||= {};
            }

            valueAutomation = valueAutomation[nameParts[i]] ||= {};
        }

        const name = nameParts[nameParts.length - 1];
        store[name] = def;

        await this.#parseDefinition(bid, def);
    }

    /**
     * @function unRegister - Unregister a data definition
     * @param name
     */
    async unRegister(bid) {
        delete this.#store[bid];
        delete this.#valueAutomation[bid];
        delete this.#defaultAutomationMap[bid];
        delete this.#validationAutomationMap[bid];
        delete this.#validationAutomation[bid];
    }

    addDefaultsAutomation(bid, path, field, fn, value, trueValue, falseValue) {
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

    addValidationAutomation(bid, path, field, fn, def) {
        const propertyPath = `${path}.${field}`.replace("context.", "");
        let obj = this.#validationAutomation[bid];
        let collection = obj[propertyPath] ||= [];
        collection.push({ condition: fn, def });
    }

    removeAutomation(name, field) {
        delete this.#valueAutomation[name][field];
    }

    remove(bid) {
        delete this.#store[bid];
        delete this.#valueAutomation[bid];
        delete this.#defaultAutomationMap[bid];
    }

    async automateValues(bid, fieldPath) {
        if (this.#defaultAutomationMap[bid] == null) return;

        if (fieldPath.indexOf(".") == -1) {
            fieldPath = `context.${fieldPath}`;
        }

        const contextMap = this.#defaultAutomationMap[bid][fieldPath];
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

    async automateValidations(bid, fieldPath) {
        if (this.#validationAutomationMap[bid] == null) return;
        const automationFields = this.#validationAutomationMap[bid][fieldPath];

        if (automationFields == null) return;

        for (const field of automationFields) {
            const definitions = this.#validationAutomation[bid][field];

            for (const def of definitions) {
                const addRules = await def.condition(bid);

                for (const ruleDef of def.def) {
                    ruleDef.required = addRules;
                    await crs.binding.ui.apply(bid, field, ruleDef.rule, ruleDef);
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

    async applyValidations(bid) {
        const definitions = this.#store[bid];

        for (const defKey of Object.keys(definitions)) {
            const def = definitions[defKey];
            const path = def.name;

            for (const field of Object.keys(def.fields)) {
                const fieldDef = def.fields[field];

                await this.#parseDefaultValidations(fieldDef, bid, path, field);
            }
        }
    }
}

crs.binding.dataDef = new DataDefStore();