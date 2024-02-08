/**
 * Initialize the mocking objects for testing purposes
 */
import * as path from "https://deno.land/std/path/mod.ts";
import {exists} from "https://deno.land/std/fs/mod.ts"
import {ElementMock} from "./element-mock.js"
import "./custom-elements.js";
import "./document-mock.js";

export async function init() {
    globalThis.DocumentFragment = ElementMock;
    globalThis.HTMLElement = ElementMock;
    globalThis.HTMLInputElement = ElementMock;
    globalThis.requestAnimationFrame = (callback) => callback();

    const crs_binding = "./../../src/crs-binding.js";
    await import(crs_binding);

    const crs_bindable_element = "./../../src/classes/bindable-element.js";
    await import(crs_bindable_element);
}