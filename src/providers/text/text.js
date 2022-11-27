export default class TemplateSrcProvider {
    async parseElement(element, context, ctxName, parentId) {
        if (element.textContent.length == 0) return "";

        if (element.textContent.indexOf("${") !== -1 || element.textContent.indexOf("&{") !== -1) {
            console.error("this text has binding")
        }
    }
}