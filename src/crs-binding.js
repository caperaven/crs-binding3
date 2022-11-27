import {Providers} from "./providers.js";
import {parseElement, parseElements, parseAttribute, parseAttributes} from "./parsers.js";
import {BindingData} from "./store/binding-data.js";
import {sanitize} from "./expressions.js";
import {compile, release} from "./events.js";
import {disposeProperties, getValueOnPath, setValueOnPath, getPathOfFile} from "./utils.js";
import {TranslationsManager} from "./translations.js";

globalThis.crs ||= {};

globalThis.crs.binding = {
    root: import.meta.url.replace("/crs-binding.js", ""),
    ignore: ["template", "script", "style"],
    
    data: new BindingData(),
    translations: new TranslationsManager(),
    functions: new Map(),

    classes: {
        AsyncFunction: Object.getPrototypeOf(async function(){}).constructor
    },

    providers: new Providers({
        "style.if": "$root/providers/style-if.js",
        "style.case": "$root/providers/style-case.js",
        "classlist.if": "$root/providers/classlist-if.js",
        "classlist.case": "$root/providers/classlist-case.js",
        ".call": "$root/providers/call.js",
        ".attr": "$root/providers/attr.js",
        "style.": "$root/providers/style-property.js",
        ".if": "$root/providers/attr-if.js",
        ".case": "$root/providers/attr-case.js",
    }),

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
    },

    utils: {
        disposeProperties,
        getValueOnPath,
        setValueOnPath,
        getPathOfFile
    }
}