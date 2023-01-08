export async function inflationFactory(element, ctxName) {
    const code = [];

    if (element.nodeName === "TEMPLATE") {
        element = element.content.cloneNode(true);
    }

    attributes("element", element, code);

    if (element.children.length === 0) {
        textContent("element", element, code);
    }
    else {
        children("element", element, code);
    }

    return new Function("element", ctxName, code.join("\n"));
}

function textContent(path, element, code) {
    code.push([path, ".textContent = `", element.textContent, "`;"].join(""));
}

function children(path, element, code) {
    for (let i = 0; i < element.children.length; i++) {
        code.push([path, ".children", `[${i}].textContent = `, "`", element.textContent, "`;"].join(""));
        attributes(`${path}.children[${i}]`, element.children[i], code);
    }
}

function attributes(path, element, code) {
    if (element instanceof DocumentFragment) return;

    for (const attr of element.attributes) {
        if (attr.nodeValue.indexOf("${") != -1) {
            code.push([`${path}.setAttribute("${attr.nodeName}",`, "`", attr.nodeValue, "`",  ");"].join(""));
        }
    }
}

crs.binding.expression.inflationFactory = inflationFactory;