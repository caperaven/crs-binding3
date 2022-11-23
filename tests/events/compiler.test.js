import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

describe("compiler tests", async () => {
    it("compile expressions - standard", async () => {
        const expr = "firstName == 'John'";
        assertEquals(crs.binding.functions.size, 0);

        const exp = crs.binding.expression.compile(expr);
        assertEquals(crs.binding.functions.size, 1);
        assert(exp.function != null);
        assertEquals(exp.parameters.isLiteral, false);
        assertEquals(exp.parameters.isHTML, false);
        assertEquals(exp.parameters.expression, "context.firstName == 'John'");
        assertEquals(exp.parameters.properties.length, 1);
        assertEquals(exp.parameters.properties[0], "firstName");
        assertEquals(exp.count, 1);

        // register same express.
        // don't create a new function but increase the count
        const exp2 = crs.binding.expression.compile(expr);
        assertEquals(crs.binding.functions.size, 1);
        assertEquals(exp2.count, 2);

        // release first count
        crs.binding.expression.release(exp);
        assertEquals(crs.binding.functions.size, 1);

        // release second count
        crs.binding.expression.release(exp);
        assertEquals(crs.binding.functions.size, 0);
    })
})