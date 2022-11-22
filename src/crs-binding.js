import {Providers} from "./providers.js";
import {parseElement, parseElements, parseAttribute, parseAttributes} from "./parsers.js";

globalThis.crs ||= {};

globalThis.crs.binding = {
    root: import.meta.url.replace("crs-binding.js", ""),

    providers: new Providers({
        "call": "$root/providers/call.js"
    }),

    parsers: {
        parseElement,
        parseElements,
        parseAttribute,
        parseAttributes
    },
}