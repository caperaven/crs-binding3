import { beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../../mockups/init.js";

await init();

beforeAll(async () => {
    await import("../../../src/expressions/code-factories/case.js");
});

describe("case function tests", async () => {
    it ("caseFunction", async () => {
        let fn = await crs.binding.expression.caseFunction("value < 10: 'yes', value < 20: 'ok', default: 'no'");
        let value1 = fn({value: 5});
        let value2 = fn({value: 15});
        let value3 = fn({value: 25})

        assertEquals(value1, 'yes');
        assertEquals(value2, 'ok');
        assertEquals(value3, 'no');

        fn = await crs.binding.expression.caseFunction("value < 10: 'yes', value < 20: 'ok'");
        value1 = fn({value: 5});
        value2 = fn({value: 15});
        value3 = fn({value: 25})

        assertEquals(value1, 'yes');
        assertEquals(value2, 'ok');
        assertEquals(value3, undefined);
    })
})
