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
            preCode.push(`${path}.removeAttribute("${attr.nodeName}");`);
            const exp = await crs.binding.expression.sanitize(attr.nodeValue.trim(), ctxName);
            code.push([`${path}.setAttribute("${attr.nodeName}",`, "`", exp.expression, "`",  ");"].join(""));
        }
        else if (attr.nodeName.indexOf("style.") != -1) {
            await styles(attr, path, preCode, code, ctxName);
        }
        else if (attr.nodeName.indexOf("classlist.case") != -1) {

        }
        else if (attr.nodeName.indexOf("classlist.if") != -1) {
            await classListIf(attr, path, preCode, code, ctxName);
        }
        else if (attr.nodeName.indexOf(".if") != -1) {
            await ifAttribute(attr, path, preCode, code, ctxName);
        }
    }
}

async function classListIf(attr, path, preCode, code, ctxName) {
    const parts = attr.nodeValue.split("?")[1].split(":");
    preCode.push(`${path}.classList.remove(${parts.join(",")});`);

    const exp = await crs.binding.expression.sanitize(attr.nodeValue.trim(), ctxName);
    code.push([`${path}.classList.add(`, exp.expression, ");"].join(""));
}

async function ifAttribute(attr, path, preCode, code, ctxName) {
    preCode.push(`${path}.removeAttribute("${attr.nodeName}");`);
    const exp = await crs.binding.expression.sanitize(attr.nodeValue.trim(), ctxName);
    code.push([`${path}.setAttribute("${attr.nodeName.replace(".if", "")}",`, exp.expression,  ");"].join(""));
}

async function styles(attr, path, preCode, code, ctxName) {
    const parts = attr.nodeName.split(".");
    const exp = await crs.binding.expression.sanitize(attr.nodeValue.trim(), ctxName);
    preCode.push(`${path}.style.${parts[1]} = "";`);

    if (attr.nodeName.indexOf(".case") == -1) {
        code.push([`${path}.style.${parts[1]} =`, exp.expression,  ";"].join(""));
    }
    else {
        const codeParts = exp.expression.split(",");
        for (const line of codeParts) {
            if (line.indexOf("context.default") != -1) {
                preCode.push(`${path}.style.${parts[1]} = ${line.split(":")[1].trim()};`);
                continue;
            }

            const lineParts = line.split("?");
            const condition = lineParts[0].trim();
            const values = (lineParts[1] || lineParts[0]).split(":");

            code.push(`if (${condition}) {`);
            code.push(`    ${path}.style.${parts[1]} = ${values[0].trim()};`);
            code.push(`}`);

            if (values.length > 1) {
                code.push(`else {`);
                code.push(`    ${path}.style.${parts[1]} = ${values[1].trim()};`);
                code.push(`}`);
            }
        }
    }
}

crs.binding.expression.inflationFactory = inflationFactory;