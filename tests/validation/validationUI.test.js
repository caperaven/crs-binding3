import { describe, it, beforeAll } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertExists, assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";
import {ElementMock} from "./../mockups/element-mock.js";

await init();
const element1 = new ElementMock("input");
element1.__bid = 1;

const element2 = new ElementMock("input");
element2.__bid = 2;

beforeAll(async () => {
    await import("./../../src/validation/validation-ui.js");

    document.querySelectorAll = (selector) => {
        return [element1, element2];
    }
})

describe("UI validation tests", async () => {
    it("initialized", async () => {
        assertExists(crs.binding.ui);
    })

    it ("required", async () => {
        crs.binding.ui.required(element1, true);
        assertEquals(element1.getAttribute("required"), "required");

        crs.binding.ui.required(element1, false);
        assertEquals(element1.getAttribute("required"), undefined);
    })

    it ("maxlength", async () => {
        crs.binding.ui.maxlength(element1, 10, true);
        assertEquals(element1.getAttribute("maxlength"), "10");

        crs.binding.ui.maxlength(element1, 10, false);
        assertEquals(element1.getAttribute("maxlength"), undefined);
    });

    it ("min", async () => {
        crs.binding.ui.min(element1, 10, true);
        assertEquals(element1.getAttribute("min"), "10");

        crs.binding.ui.min(element1, 10, false);
        assertEquals(element1.getAttribute("min"), undefined);
    })

    it ("max", async () => {
        crs.binding.ui.max(element1, 10, true);
        assertEquals(element1.getAttribute("max"), "10");

        crs.binding.ui.max(element1, 10, false);
        assertEquals(element1.getAttribute("max"), undefined);
    })

    it ("pattern", async () => {
        crs.binding.ui.pattern(element1, "^[0-9]*$", true);
        assertEquals(element1.getAttribute("pattern"), "^[0-9]*$");

        crs.binding.ui.pattern(element1, "^[0-9]*$", false);
        assertEquals(element1.getAttribute("pattern"), undefined);
    })

    it ("apply", async () => {
        crs.binding.ui.apply(2, "model.field", "required", {value: true});
        assertEquals(element2.getAttribute("required"), "required");

        crs.binding.ui.apply(2, "model.field", "required", {value: false});
        assertEquals(element2.getAttribute("required"), undefined);

    })
})
