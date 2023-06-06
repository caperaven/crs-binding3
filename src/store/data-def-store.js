import {ifFactory} from "../expressions/code-factories/if.js";

export class DataDefStore {
    /**
     * @field #store - The store of data definitions
     * @type {{}}
     */
    #store = {};

    /**
     * @field #valueAutomation - The store of value automation based on conditions
     * @type {{}}
     */
    #valueAutomation = {};

    /**
     * @field #automationMap - The map defines what automation to run when a particular field is changed
     * @type {{}}
     */
    #automationMap = {};

    get store() {
        return this.#store;
    }

    async #parseDefinition(name, def, ctxName) {
        for (const field of Object.keys(def.fields)) {
            const fieldDef = def.fields[field];
            const fieldPath = `${ctxName}.${field}`;

            if (fieldDef.conditionalDefaults != null) {
                for (const conditionalDefault of fieldDef.conditionalDefaults) {
                    // 1. sanitize the expression so we know what fields are affected
                    const expo = await crs.binding.expression.sanitize(conditionalDefault.conditionExpr, ctxName);

                    // 2. populate the automation map
                    for (const prop of expo.properties) {
                        const property = `${ctxName}.${prop}`;
                        this.#automationMap[name][property] ||= [];
                        this.#automationMap[name][property].push(fieldPath);
                    }

                    const fn = new crs.classes.AsyncFunction(ctxName, `return ${expo.expression}`);

                    // 3. add the automation
                    this.addAutomation(name, fieldPath, fn, conditionalDefault.value);
                }
            }

            delete fieldDef.conditionalDefaults;
        }
    }

    /**
     * @function register - Register a new data definition
     * @param name {string} - The name of the data definition
     * @param def {object} - The definition
     */
    async register(name, def, ctxName = "context") {
        this.#store[name] = def;
        this.#valueAutomation[name] = {};
        this.#automationMap[name] = {};
        await this.#parseDefinition(name, def, ctxName);
    }

    /**
     * @function unRegister - Unregister a data definition
     * @param name
     */
    async unRegister(name) {
        delete this.#store[name];
        delete this.#valueAutomation[name];
        delete this.#automationMap[name];
    }

    /**
     * @function get - Get a data definition
     * @param name
     * @returns {*}
     */
    get(name) {
        return this.#store[name];
    }

    addAutomation(name, field, condition, value) {
        const collection = this.#valueAutomation[name][field] ||= [];
        collection.push({ condition: condition, value: value });
    }

    removeAutomation(name, field) {
        delete this.#valueAutomation[name][field];
    }

    async automateValues(bid, model, name, field) {
        const automationFields = this.#automationMap[name][field];
        if (automationFields == null) return;

        for (const automationField of automationFields) {
            const automations = this.#valueAutomation[name][automationField];

            for (const automation of automations || []) {
                if (automation.condition(model) === true) {
                    const value = automation.value;
                    await crs.binding.data.setProperty(bid, automationField, value, name);
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
    async create(bid, property, name) {
        const def = this.get(name);
        if (def == null) return;

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

// async function compileConditionalExp(definition) {
//     for (const field of definition.fields) {
//         if (field.conditionalDefaults != null) {
//             const conditionalDefaultsMap = definition["conditionalDefaultsMap"] ||= {};
//
//             for (const rule of field.conditionalDefaults) {
//                 const expr = await crs.binding.expression.sanitize(rule.conditionExpr, "model");
//                 const properties = expr.properties;
//
//                 for (const property of properties) {
//                     const fieldName = field["field"] || field["name"];
//                     conditionalDefaultsMap[property] ||= [];
//                     conditionalDefaultsMap[property].push(fieldName);
//                 }
//
//                 rule.conditionExpr = new Function("model", `return ${expr.expression}`);
//             }
//         }
//     }
// }

crs.binding.dataDef = new DataDefStore();