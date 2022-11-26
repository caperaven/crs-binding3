import { describe, it, beforeAll } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

describe("get on path tests", async () => {
    let obj;
    beforeAll(async () => {
        obj = {
            person: {
                firstName: "John"
            }
        }
    })

    it("valid path", async () => {
        assertEquals(crs.binding.utils.getValueOnPath(obj, "person.firstName"), "John");
    })

    it("invalid path", async () => {
        assert(crs.binding.utils.getValueOnPath(obj, "person.lastName") == null);
    })

    it("no object", async () => {
        assert(crs.binding.utils.getValueOnPath(null, "person.lastName") == null);
    })

    it("no path", async () => {
        assert(crs.binding.utils.getValueOnPath(obj, null) == null);
    })
})