import { beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../../mockups/init.js";

await init();

beforeAll(async () => {
    await import("../../../src/expressions/code-factories/if.js");
});

describe("if factory tests", async () => {
    it( "ifFactory", async () => {
        let fn = await crs.binding.expression.ifFactory("code == 'a'");
        assertEquals(fn({code: "a"}), true)
        assertEquals(fn({code: "b"}), false)

        fn = await crs.binding.expression.ifFactory("code == 'a' ? true");
        assertEquals(fn({code: "a"}), true)
        assertEquals(fn({code: "b"}), undefined)

        fn = await crs.binding.expression.ifFactory("code == 'a' ? true : false");
        assertEquals(fn({code: "a"}), true)
        assertEquals(fn({code: "b"}), false)
    })
})
