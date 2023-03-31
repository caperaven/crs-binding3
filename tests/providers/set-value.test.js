import { beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../mockups/init.js";
import {ElementMock} from "../mockups/element-mock.js";
import {createSourceFrom} from "../../src/providers/attributes/set-value.js";

await init();

describe("set value provider tests", async () => {
    it ("createSourceFrom - conditional", async () => {
        const exp = `state = state == "on" ? "off" : "on"`;
        const expected = `crs.binding.data.setProperty(1, "state", crs.binding.data.getProperty(1, "state") == "on" ? "off" : "on");`;

        const result = createSourceFrom(exp, 1);
        assertEquals(result, expected);
    })

    it ("createSourceFrom - globlas", async () => {
        const exp = "$globals.menuVisible = !$globals.menuVisible";
        const expected = `crs.binding.data.setProperty(0, "menuVisible", !crs.binding.data.getProperty(0, "menuVisible"));`;

        const result = createSourceFrom(exp, 1);
        assertEquals(result, expected);
    })

    it ("toggle property", async () => {
        const exp = `state = !state`;
        // todo
    });

    it ("createSourceFrom - set value", async () => {
        const exp = "property = 10";
        const expected = `crs.binding.data.setProperty(1, "property", 10);`;

        const result = createSourceFrom(exp, 1);
        assertEquals(result, expected);
    });

    it ("createSourceFrom - attribute value conditional", async () => {
        // 1. element query
        // 2. attribute name
        // 3. if it is a global search or not - true is global
        const exp = "state = attr('#input', 'value', true) == '1' ? 'state1' : 'state2'";
        const expected = `const getAttrElement = document.querySelector("'#input'"); const attrValue = getAttrElement.getAttribute("'value'"); crs.binding.data.setProperty(1, "state", attrValue == '1' ? 'state1' : 'state2');`;

        const result = createSourceFrom(exp, 1);
        assertEquals(result, expected);
    })

    it ("createSourceFrom - attribute value", async () => {
        const exp = "state = attr('#input', 'value', true))"
        const expected = `const getAttrElement = element.querySelector("'#input'"); const attrValue = getAttrElement.getAttribute("'value'"); crs.binding.data.setProperty(1, "state", attrValue));`;

        const result = createSourceFrom(exp, 1);
        assertEquals(result, expected);
    })

    it ("createSourceFrom - property value conditional", async () => {
        // 1. element query
        // 2. attribute name
        // 3. if it is a global search or not - true is global
        const exp = "state = prop('#input', 'value', true) == '1' ? 'state1' : 'state2')";
        const expected = "const getPropElement = document.querySelector(\"'#input'\"); const propValue = getPropElement[\"'value'\"]; crs.binding.data.setProperty(1, \"state\", propValue == '1' ? 'state1' : 'state2'));";

        const result = createSourceFrom(exp, 1);
        assertEquals(result, expected);
    })

    it ("createSourceFrom - property value", async () => {
        const exp = "state = prop('#input', 'value', true))";
        const expected = `const getPropElement = element.querySelector("'#input'"); const propValue = getPropElement["'value'"]; crs.binding.data.setProperty(1, "state", propValue));`;

        const result = createSourceFrom(exp, 1);
        assertEquals(result, expected);
    })

    it ("createSourceFrom - event value", async () => {
        const exp = "state = $event.clientX";
        const expected = `crs.binding.data.setProperty(1, "state", event.clientX);`;

        const result = createSourceFrom(exp, 1);
        assertEquals(result, expected);
    })

    it ("createSourceFrom - element attribute to element property", async () => {
        const exp = "prop('#input', value, true) = attr('#numVal', value, true) + 10";
        const expected = `const setPropElement = document.querySelector("'#input'"); const getAttrElement = document.querySelector("'#numVal'"); const attrValue = getAttrElement.getAttribute("value"); setPropElement["value"] = attrValue + 10;`;

        const result = createSourceFrom(exp, 1);
        assertEquals(result, expected);
    })

    it ("createSourceFrom - element property to element attribute", async () => {
        const exp = "attr('#numVal', value, true) = prop('#input', value, true)";
        const expected = `const setAttrElement = document.querySelector("'#numVal'"); const getPropElement = document.querySelector("'#input'"); const propValue = getPropElement["value"]; setAttrElement.setAttribute("value", propValue);`;

        const result = createSourceFrom(exp, 1);
        assertEquals(result, expected);
    })

    it ("createSourceFrom - attribute to attribute based on event", async () => {
        const exp = "attr('#numVal', value, true) = attr('#input', value, true)";
        const expected = `const setAttrElement = document.querySelector("'#numVal'"); const getAttrElement = document.querySelector("'#input'"); const attrValue = getAttrElement.getAttribute("value"); setAttrElement.setAttribute("value", attrValue);`;

        const result = createSourceFrom(exp, 1);
        assertEquals(result, expected);
    })

    it ("createSourceFrom - element property to element property based on event", async () => {
        const exp = "prop('#numVal', value, true) = prop('#input', value, true)";
        const expected = `const setPropElement = document.querySelector("'#numVal'"); const getPropElement = document.querySelector("'#input'"); const propValue = getPropElement["value"]; setPropElement["value"] = propValue;`;

        const result = createSourceFrom(exp, 1);
        assertEquals(result, expected);
    })
});