/**
 * @class TemplateSrcProvider - This provider loads html from file as defined by the src attribute.
 * The template position is replaced with the content of that file.
 */
export default class TemplateSrcProvider {
    async parse(element) {
        const path = element.getAttribute("src");
        const content = await fetch(path).then(result => result.text());
        const template = document.createElement("template");
        template.innerHTML = content;
        element.replaceWith(template.content.cloneNode(true));
    }
}