import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

describe("getPathOfFile tests", async () => {
    it("null", async () => {
        assertEquals(crs.binding.utils.getPathOfFile(), undefined);
    })

    it ("closed", async () => {
        assertEquals(crs.binding.utils.getPathOfFile("/part1/part2/"), "/part1/part2/");
    })

    it ("not closed - strip off last part", async () => {
        assertEquals(crs.binding.utils.getPathOfFile("/part1/part2/part3"), "/part1/part2/");
    })
})