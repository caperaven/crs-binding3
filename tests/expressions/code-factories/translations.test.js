import { beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../../mockups/init.js";

await init();

beforeAll(async () => {
    await import("../../../src/expressions/code-factories/translate.js");
});

describe("translate factory tests", async () => {
    it( "translateFactory - simple", async () => {
        let exp = await crs.binding.expression.translateFactory("&{save}");
        assertEquals(exp, "${crs.binding.translations.get('save')}");
    })

    it( "translateFactory - sentance", async () => {
        let exp = await crs.binding.expression.translateFactory("&{save} changes");
        assertEquals(exp, "${crs.binding.translations.get('save')} changes");
    })

    it( "translateFactory - sentance multiple", async () => {
        let exp = await crs.binding.expression.translateFactory("&{save} changes &{there}");
        assertEquals(exp, "${crs.binding.translations.get('save')} changes ${crs.binding.translations.get('there')}");
    })
})
