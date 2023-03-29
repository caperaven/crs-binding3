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
        const exp = "state = attr('#input', 'value', true) == '1' ? 'state1' : 'state2')"
        const expected = "const value = document.querySelector('#input').getAttribute('value'); crs.binding.data.setProperty(1, 'state', value == '1' ? 'state1' : 'state2')";
    })

    it ("createSourceFrom - attribute value", async () => {
        const exp = "state = attr('#input', 'value', true))"
        const expected = "const value = document.querySelector('#input').getAttribute('value'); crs.binding.data.setProperty(1, 'state', value)";
    })

    it ("createSourceFrom - property value conditional", async () => {
        // 1. element query
        // 2. attribute name
        // 3. if it is a global search or not - true is global
        const exp = "state = property('#input', 'value', true) == '1' ? 'state1' : 'state2')";
        const expected = "const value = document.querySelector('#input').value; crs.binding.data.setProperty(1, 'state', value == '1' ? 'state1' : 'state2')";
    })

    it ("createSourceFrom - property value", async () => {
        const exp = "state = property('#input', 'value', true))";
        const expected = "const value = document.querySelector('#input').value; crs.binding.data.setProperty(1, 'state', value)";
    })

    it ("createSourceFrom - event value", async () => {
        const exp = "state = $event.clientX";
        const expected = "crs.binding.data.setProperty(1, 'state', event.clientX)";
    })

    it ("createSourceFrom - mixed expressions", async () => {
        const exp = "property('#input', value, true) = attr('#numVal', value, true) + 10";
        const expected = "const inputElement = document.querySelector('#input'); const numValElement = document.querySelector('#numVal'); inputElement.value = numValElement.getAttribute('value') + 10";
    })
});