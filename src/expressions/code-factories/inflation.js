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

    if (element.nodeName === "TEMPLATE") {
        element = element.content.cloneNode(true).firstElementChild;
    }

    if (element.nodeName != "#document-fragment") {
        attributes("element", element, code);
    }

    if (element.children.length === 0) {
        textContent("element", element, code);
    }
    else {
        children("element", element, code);
    }

    return new Function("element", ctxName, code.join("\n"));
}

/**
 * @function textContent - create the code that will inflate the text content of an element.
 * @param path {string} - the path to the element
 * @param element {HTMLElement} - the element to inflate
 * @param code {Array} - the array of code lines
 */
function textContent(path, element, code) {
    code.push([path, ".textContent = `", element.textContent, "`;"].join(""));
}

/**
 * @function children - create the code that will inflate the children of an element.
 * @param path {string} - the path to the element
 * @param element {HTMLElement} - the element to inflate
 * @param code {Array} - the array of code lines
 */
function children(path, element, code) {
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];

        if (child.children.length > 0) {
            children(`${path}.children[${i}]`, child, code);
        }
        else {
            code.push([path, ".children", `[${i}].textContent = `, "`", child.textContent.trim(), "`;"].join(""));
        }

        attributes(`${path}.children[${i}]`, element.children[i], code);
    }
}

/**
 * @function attributes - create the code that will inflate the attributes of an element.
 * @param path {string} - the path to the element
 * @param element {HTMLElement} - the element to inflate
 * @param code {Array} - the array of code lines
 */
function attributes(path, element, code) {
    if (element instanceof DocumentFragment) return;

    for (const attr of element.attributes) {
        if (attr.nodeValue.indexOf("${") != -1) {
            code.push([`${path}.setAttribute("${attr.nodeName}",`, "`", attr.nodeValue, "`",  ");"].join(""));
        }
    }
}

crs.binding.expression.inflationFactory = inflationFactory;