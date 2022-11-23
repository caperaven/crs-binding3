import {Providers} from "./providers.js";
import {parseElement, parseElements, parseAttribute, parseAttributes} from "./parsers.js";
import {BindingData} from "./binding-data.js";
import {sanitize} from "./expressions.js";
import {compile, release} from "./events.js";

globalThis.crs ||= {};

globalThis.crs.binding = {
    root: import.meta.url.replace("crs-binding.js", ""),

    data: new BindingData(),
    functions: new Map(),

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
    }
}