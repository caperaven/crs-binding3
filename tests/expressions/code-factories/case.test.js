import { beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../../mockups/init.js";

await init();

beforeAll(async () => {
    await import("../../../src/expressions/code-factories/case.js");
});

describe("case factory tests", async () => {
    it ("caseFactory", async () => {
        let exp = await crs.binding.expression.caseFactory("value < 10: 'yes', value < 20: 'ok', default: 'no'");
        let value1 = await exp.function({value: 5});
        let value2 = await exp.function({value: 15});
        let value3 = await exp.function({value: 25});
        crs.binding.expression.release(exp);

        assertEquals(value1, 'yes');
        assertEquals(value2, 'ok');
        assertEquals(value3, 'no');

        exp = await crs.binding.expression.caseFactory("value < 10: 'yes', value < 20: 'ok'");
        value1 = await exp.function({value: 5});
        value2 = await exp.function({value: 15});
        value3 = await exp.function({value: 25})
        crs.binding.expression.release(exp);

        assertEquals(value1, 'yes');
        assertEquals(value2, 'ok');
        assertEquals(value3, undefined);
    })

    it ("duplicate test", async () => {
        let exp = await crs.binding.expression.caseFactory("value < 10: 'yes', value < 20: 'ok'");
        assertEquals(crs.binding.functions.get(exp.key).count, 1);

        await crs.binding.expression.caseFactory("value < 10: 'yes', value < 20: 'ok'");
        assertEquals(crs.binding.functions.get(exp.key).count, 2);

        crs.binding.expression.release(exp);
        assertEquals(crs.binding.functions.get(exp.key).count, 1);

        crs.binding.expression.release(exp);
        assertEquals(crs.binding.functions.get(exp.key), undefined);
    })

    it ("complex statement", async () => {
        let exp = await crs.binding.expression.caseFactory("current == false: 'non-current-day', new Date().toLocaleDateString() === date.toLocaleDateString(): 'today'");
        assertEquals(crs.binding.functions.get(exp.key).count, 1);

        const key = exp.key;
        crs.binding.expression.release(exp);
        assertEquals(crs.binding.functions.get(key), undefined);
    })
})
