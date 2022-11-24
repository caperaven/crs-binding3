import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";
import {getValueOnPath} from "../../src/utils/get-value-on-path.js";

await init();

describe("get on path tests", async () => {
    it("valid path", async () => {
        const obj = {
            person: {
                firstName: "John"
            }
        }

        assertEquals(getValueOnPath(obj, "person.firstName"), "John");
    })

    it("valid path", async () => {
        const obj = {
            person: {
                firstName: "John"
            }
        }

        assert(getValueOnPath(obj, "person.lastName") == null);
    })

    it("invalid path", async () => {
        assert(getValueOnPath(null, "person.lastName") == null);
    })
})