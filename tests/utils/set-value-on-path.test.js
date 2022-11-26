import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

describe("set on path tests", async () => {
    it("simple", async () => {
        const obj = {};
        crs.binding.utils.setValueOnPath(obj, "person.firstName", "John");
        assertEquals(obj.person.firstName, "John");
    })

    it ("no object - return", async () => {
        const obj = null;
        crs.binding.utils.setValueOnPath(obj, "person.firstName", "John");
        assertEquals(obj?.person?.firstName, undefined);
    })

    it ("no path - return", async () => {
        const obj = {};
        crs.binding.utils.setValueOnPath(obj, null, "John");
        assertEquals(obj?.person?.firstName, undefined);
    })

    it ("set null value", async () => {
        const obj = {};
        crs.binding.utils.setValueOnPath(obj, "person.firstName", null);
        assertEquals(obj.person.firstName, null);
    })

    it ("set value on existing path", async () => {
        const obj = {
            person: {
                lastName: "Doe"
            }
        }

        crs.binding.utils.setValueOnPath(obj, "person.firstName", "John");

        assertEquals(obj.person.firstName, "John");
        assertEquals(obj.person.lastName, "Doe");
    })
})