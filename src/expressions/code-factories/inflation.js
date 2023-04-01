/**
 * @function inflationFactory - Creates a function that inflates a template with data
 * @param element {HTMLElement} - the template to inflate
 * @param ctxName {string} - the name of the context variable, defaults to "context"
 * @returns {Promise<Function>}
 *
 * @example <caption>inflation expression</caption>
 * <template>
 *     <div>
 *         <span>${context.name}</span>
 *     </div>
 * </template>
 *
 * const fn = await crs.binding.expression.inflationFactory(template);
 */
export async function inflationFactory(element, ctxName = "context") {
    const code = [];
    const preCode = [];

    if (element.nodeName === "TEMPLATE") {
        element = element.content.cloneNode(true).firstElementChild;
    }

    if (element.nodeName != "#document-fragment") {
        await attributes("element", element, preCode, code, ctxName);
    }

    if (element.children.length === 0) {
        await textContent("element", element, code, ctxName);
    }
    else {
        await children("element", element, preCode, code, ctxName);
    }

    return new Function("element", ctxName, [...preCode, ...code].join("\n"));
}

/**
 * @function textContent - create the code that will inflate the text content of an element.
 * @param path {string} - the path to the element
 * @param element {HTMLElement} - the element to inflate
 * @param code {Array} - the array of code lines
 */
async function textContent(path, element, code, ctxName) {
    const exp = await crs.binding.expression.sanitize(element.textContent.trim(), ctxName);
    code.push([path, ".textContent = `", exp.expression, "`;"].join(""));
}

/**
 * @function children - create the code that will inflate the children of an element.
 * @param path {string} - the path to the element
 * @param element {HTMLElement} - the element to inflate
 * @param code {Array} - the array of code lines
 */
async function children(path, element, preCode, code, ctxName) {
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];

        if (child.children.length > 0) {
            await children(`${path}.children[${i}]`,preCode, child, code, ctxName);
        }
        else {
            const exp = await crs.binding.expression.sanitize(child.textContent.trim(), ctxName);
            code.push([path, ".children", `[${i}].textContent = `, "`", exp.expression, "`;"].join(""));
        }

        await attributes(`${path}.children[${i}]`, element.children[i], preCode, code, ctxName);
    }
}

/**
 * @function attributes - create the code that will inflate the attributes of an element.
 * @param path {string} - the path to the element
 * @param element {HTMLElement} - the element to inflate
 * @param code {Array} - the array of code lines
 */
async function attributes(path, element, preCode, code, ctxName) {
    if (element instanceof DocumentFragment) return;

    for (const attr of element.attributes) {
        if (attr.nodeValue.indexOf("${") != -1) {
            const exp = await crs.binding.expression.sanitize(attr.nodeValue.trim(), ctxName);
            code.push([`${path}.setAttribute("${attr.nodeName}",`, "`", exp.expression, "`",  ");"].join(""));
        }

        if (attr.nodeName.indexOf("style.") != -1) {
            const exp = await crs.binding.expression.sanitize(attr.nodeValue.trim(), ctxName);
            code.push([`${path}.style.${attr.nodeName.split(".")[1]} =`, exp.expression,  ";"].join(""));
        }

        if (attr.nodeName.indexOf("classlist.if") != -1) {
            const exp = await crs.binding.expression.sanitize(attr.nodeValue.trim(), ctxName);
            code.push([`${path}.classList.add(`, exp.expression, ");"].join(""));
        }
    }
}

crs.binding.expression.inflationFactory = inflationFactory;