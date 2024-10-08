/**
 * @file crs-binding.js - This is the main file of the binding engine.
 * All the core features are defined here and exported to the global scope.
 *
 * @version 1.0.0
 * @license MIT for free and opensource software
 */

import {Providers} from "./providers.js";
import {parseElement, parseElements, parseAttribute, parseAttributes} from "./parsers.js";
import {BindingData} from "./store/binding-data.js";
import {sanitize, translateFactory} from "./expressions.js";
import {compile, release} from "./events.js";
import {disposeProperties, getValueOnPath, setValueOnPath, getPathOfFile, Debug} from "./utils.js";
import {TranslationsManager} from "./managers.js";
import {markElement, unmarkElement} from "./utils/mark-element.js";
import {disableEvents, enableEvents} from "./events/dom-events.js";
import {TemplatesManager} from "./managers/templates-manager.js";
import {TemplateInflationStore} from "./store/template-inflation-store.js";
import {IdleTaskManager} from "./idle/idleTaskManager.js";
import {EventStore} from "./store/event-store.js";
import {getConverterParts} from "./utils/converter-parts.js";
import {relativePathFrom} from "./utils/relative-path.js";
import {TemplateProviderStore} from "./store/template-provider-store.js";
import {Queryable} from "./utils/queryable.js";

globalThis.GLOBALS = "$globals.";
globalThis.crs ||= {};
globalThis.crs.classes ||= {};
globalThis.crs.classes.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

/**
 * @namespace crs.binding - The binding engine namespace.
 */
globalThis.crs.binding = {
    root: import.meta.url.replace("/crs-binding.js", ""),

    /**
     * @property idleTaskManager - The idle task manager.
     */
    idleTaskManager: new IdleTaskManager(),

    /**
     * @property enableStore - Enable the event store
     */
    eventStore: new EventStore(),

    /**
     * @property templateInflationStore - Register custom template element for the parser to handle
     */
    templateProviders: new TemplateProviderStore(),

    /**
     * @property ignore - elements to ignore when parsing.
     */
    ignore: ["TEMPLATE", "SCRIPT", "STYLE"],

    ignoreChildren: ["PERSPECTIVE-ELEMENT"],

    /**
     * @property data - The binding data store where the binding context data is kept.
     */
    data: new BindingData(),

    /**
     * @property templates - The template manager.
     */
    translations: new TranslationsManager(),

    /**
     * @property functions - store where compiled functions are kept.
     */
    functions: new Map(),

    /**
     * @property elements - map where the key is the uuid of the element and the value is the element.
     */
    elements: {},

    /**
     * @property elements - map where the key is the uuid of the element and the value is the element.
     */
    queryable: new Queryable(),

    /**
     * @property dom - dom related features and utilities are defined here.
     */
    dom: {
        enableEvents,
        disableEvents
    },

    /**
     * @property providers - map of providers where the key is the query selector and the value is the provider.
     * Initially it defines the file path to the provider.
     * Once requested the provider is loaded and the value is replaced with the provider instance.
     */
    providers: new Providers({
            "^style\..*\.if$"   : "$root/providers/attributes/style-if.js",
            "^style\..*\.case$" : "$root/providers/attributes/style-case.js",
            "^(keydown|keyup)\..+\..*$" : "$root/providers/events/keyboard-event.js",
            "classlist.if"      : "$root/providers/attributes/classlist-if.js",
            "classlist.case"    : "$root/providers/attributes/classlist-case.js",
            "classlist.toggle"  : "$root/providers/attributes/classlist-toggle.js",
            ".bind"             : "$root/providers/properties/bind.js",
            ".two-way"          : "$root/providers/properties/bind.js",
            ".one-way"          : "$root/providers/properties/one-way.js",
            ".once"             : "$root/providers/properties/once.js",
            ".changed."         : "$root/providers/properties/changed.js",
            ".setvalue"         : "$root/providers/attributes/set-value.js",
            ".attr.toggle"      : "$root/providers/attributes/attr-toggle.js",
            ".attr"             : "$root/providers/attributes/attr.js",
            ".if"               : "$root/providers/attributes/attr-if.js",
            ".case"             : "$root/providers/attributes/attr-case.js",
            "style."            : "$root/providers/attributes/style-property.js",
            "ref"               : "$root/providers/attributes/ref.js",
            ".call"             : "$root/providers/attributes/call.js",
            ".emit"             : "$root/providers/attributes/emit.js",
            ".post"             : "$root/providers/attributes/post.js",
            ".process"          : "$root/providers/attributes/process.js"
        },
        {
            "template[for]"     : "$root/providers/element/template-repeat-for.js",
            "template[src]"     : "$root/providers/element/template-src.js",
            "template"          : "$root/providers/element/template.js",
        }
    ),

    /**
     * @property parsers - parsers for elements and attributes.
     * This is the core of the binding engine, parsing the dom and starting off the binding processes.
     */
    parsers: {
        parseElement,
        parseElements,
        parseAttribute,
        parseAttributes
    },

    /**
     * @property expression - expression related features and utilities are defined here.
     */
    expression: {
        sanitize,
        compile,
        release,
        translateFactory
    },

    debug: Debug,

    /**
     * @property utils - utilities for the binding engine, mostly used internally but can also be used externally.
     */
    utils: {
        disposeProperties,
        getValueOnPath,
        setValueOnPath,
        getPathOfFile,
        markElement,
        unmarkElement,
        getConverterParts,
        relativePathFrom
    },

    /**
     * @property inflation - template inflation related features and utilities are defined here.
     */
    inflation: {
        store: new TemplateInflationStore()
    },

    /**
     * @property templates - template related features and utilities are defined here.
     */
    templates: new TemplatesManager()
}

/**
 * @property $global - The global binding context.
 * Here we define a readonly property on the global binding context.
 * This is used to define global variables.
 */
Object.defineProperty(globalThis.crs.binding, '$global', {
    value: 0,
    writable: false
});

await crs.binding.providers.addTextProvider("$root/providers/text/text.js");

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
};