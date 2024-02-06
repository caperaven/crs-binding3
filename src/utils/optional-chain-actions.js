/**
 * We have expressions such as "model?.object?.property === 'value' ? 'yes' : 'no'"
 * We want to find the ? in the ternary expression index or split the expression based on the ternary operator.
 */

export class OptionalChainActions {


    static indexOf(exp) {
        const newExp = exp.split("?.").join("~");
        return newExp.indexOf("?");
    }

    static hasTernary(exp) {
        const newExp = exp.split("?.").join("~");
        return newExp.indexOf("?") > -1;
    }

    static split(exp) {
        const newExp = exp.split("?.").join("~");
        const result = newExp.split("?");
        result[0] = result[0].split("~").join("?.").trim();

        // for expressions like "code == 'a'" there is no second part.
        if (result.length > 1) {
            result[1] = result[1].trim();
        }

        return result;
    }
}