import {Providers} from "./providers.js";
import {parseElement, parseElements, parseAttribute, parseAttributes} from "./parsers.js";
import {BindingData} from "./store/binding-data.js";
import {sanitize} from "./expressions.js";
import {compile, release} from "./events.js";
import {disposeProperties, getValueOnPath, getPathOfFile} from "./utils.js";


globalThis.crs ||= {};

globalThis.crs.binding = {
    root: import.meta.url.replace("crs-binding.js", ""),

    data: new BindingData(),
    functions: new Map(),

    classes: {
        AsyncFunction: Object.getPrototypeOf(async function(){}).constructor
    },

    providers: new Providers({
        "call": "$root/providers/call.js"
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
        getPathOfFile
    }
}