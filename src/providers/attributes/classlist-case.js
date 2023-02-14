import "../../expressions/code-factories/case.js";
import {ClassListBase} from "./classlist-base.js";

/**
 * @class ClassListCaseProvider
 * @description Add and remove classes on a element based on a case expression.
 * These are processed as if statements, the first condition that passes will set determine the class.
 *
 * @example <caption>html, case expression with default</caption>
 * <div classlist.case="age <= 10: 'red', age <= 20: 'blue', default: 'green'">Class list Test</div>
 *
 * @example <caption>html, case expression with arrays</caption>
 * <div classlist.case="age <= 10: ['red', 'blue'], age <= 20: ['blue', 'white'], default: 'green'">Class list Test</div>
 *
 * if (age <= 10) add class 'red' but remove 'blue' and 'green'
 * if (age <= 20) add class 'blue' but remove 'red' and 'green'
 * if the first two conditions don't pass add class 'green' but remove 'red' and 'blue'
 */
export default class ClassListCaseProvider extends ClassListBase {
    get providerKey() { return "classlist.case"; }
    async parse(attr, context) {
        const classes = getCaseClasses(attr.value);

        await super.parse(attr, context, classes, async (value) => {
            return await crs.binding.expression.caseFactory(value);
        });
    }
}

function getCaseClasses(exp) {
    const set = new Set();
    const statements = exp.split(",");

    for (const statement of statements) {
        const parts = statement.indexOf(":") != -1 ? statement.split(":") : [0, statement];

        const values = parts[1]
            .replaceAll("[", "")
            .replaceAll("]", ":")
            .replaceAll(",", ":")
            .replaceAll("'", "")
            .split(":")
            .map(item => item.trim())
            .filter(item => item.length > 0);

        set.add(...values)
    }

    return Array.from(set);
}