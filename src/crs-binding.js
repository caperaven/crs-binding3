import {Providers} from "./providers.js";
import {parseElement, parseElements, parseAttribute, parseAttributes} from "./parsers.js";
import {BindingData} from "./store/binding-data.js";
import {sanitize, translateFactory} from "./expressions.js";
import {compile, release} from "./events.js";
import {disposeProperties, getValueOnPath, setValueOnPath, getPathOfFile} from "./utils.js";
import {TranslationsManager} from "./managers.js";
import {markElement, unmarkElement} from "./utils/mark-element.js";

globalThis.crs ||= {};

globalThis.crs.binding = {
    root: import.meta.url.replace("/crs-binding.js", ""),
    ignore: ["TEMPLATE", "SCRIPT", "STYLE", "PERSPECTIVE-ELEMENT"],

    data: new BindingData(),
    translations: new TranslationsManager(),
    functions: new Map(),
    elements: {},

    classes: {
        AsyncFunction: Object.getPrototypeOf(async function(){}).constructor
    },

    providers: new Providers({
            "style.if": "$root/providers/attributes/style-if.js",
            "style.case": "$root/providers/attributes/style-case.js",
            "classlist.if": "$root/providers/attributes/classlist-if.js",
            "classlist.case": "$root/providers/attributes/classlist-case.js",
            ".call": "$root/providers/attributes/call.js",
            ".attr": "$root/providers/attributes/attr.js",
            "style.": "$root/providers/attributes/style-property.js",
            ".if": "$root/providers/attributes/attr-if.js",
            ".case": "$root/providers/attributes/attr-case.js",
        },
        {
            "template[for]": "$root/providers/element/template-repeat-for.js",
            "template[src]": "$root/providers/element/template-src.js",
        }
    ),

    parsers: {
        parseElement,
        parseElements,
        parseAttribute,
        parseAttributes
    },

    expression: {
        sanitize,
        compile,
        release,
        translateFactory
    },

    utils: {
        disposeProperties,
        getValueOnPath,
        setValueOnPath,
        getPathOfFile,
        markElement,
        unmarkElement
    }
}

await crs.binding.providers.addTextProvider("$root/providers/text/text.js");
