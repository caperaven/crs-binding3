import { beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../../mockups/init.js";

await init();

beforeAll(async () => {
    await import("../../../src/expressions/code-factories/if.js");
});

describe("if factory tests", async () => {
    it( "ifFactory", async () => {
        let exp = await crs.binding.expression.ifFactory("code == 'a'");
        assertEquals(await exp.function({code: "a"}), true);
        assertEquals(await exp.function({code: "b"}), false);
        crs.binding.expression.release(exp);

        exp = await crs.binding.expression.ifFactory("code == 'a' ? true");
        assertEquals(await exp.function({code: "a"}), true);
        assertEquals(await exp.function({code: "b"}), undefined);

        exp = await crs.binding.expression.ifFactory("code == 'a' ? true : false");
        assertEquals(await exp.function({code: "a"}), true);
        assertEquals(await exp.function({code: "b"}), false);
    })

    it ("duplicate test", async () => {
        let exp = await crs.binding.expression.ifFactory("code == 'hello world'");
        assertEquals(crs.binding.functions.get(exp.key).count, 1);

        await crs.binding.expression.ifFactory("code == 'hello world'");
        assertEquals(crs.binding.functions.get(exp.key).count, 2);

        crs.binding.expression.release(exp);
        assertEquals(crs.binding.functions.get(exp.key).count, 1);

        crs.binding.expression.release(exp);
        assertEquals(crs.binding.functions.get(exp.key), undefined);
    })
})
