import {Providers} from "./providers.js";
import {parseElement, parseElements, parseAttribute, parseAttributes} from "./parsers.js";
import {BindingData} from "./binding-data.js";

globalThis.crs ||= {};

globalThis.crs.binding = {
    root: import.meta.url.replace("crs-binding.js", ""),

    data: new BindingData(),

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