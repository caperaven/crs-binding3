import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

describe("compiler tests", async () => {
    it("compile expressions - standard", async () => {
        const expr = "firstName == 'John'";
        assertEquals(crs.binding.functions.size, 0);

        const exp = await crs.binding.expression.compile(expr);
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
        const exp2 = await crs.binding.expression.compile(expr);
        assertEquals(crs.binding.functions.size, 1);
        assertEquals(exp2.count, 2);

        // release first count
        crs.binding.expression.release(exp);
        assertEquals(crs.binding.functions.size, 1);

        // release second count
        crs.binding.expression.release(exp);
        assertEquals(crs.binding.functions.size, 0);
    })

    it ("compile but don't sanitize", async () => {
        const expr = "firstName == 'John'";
        const exp = await crs.binding.expression.compile(expr, null, {
            sanitize: false
        });

        assertEquals(exp.parameters.expression, "firstName == 'John'");
    })

    it ("compile custom context name", async () => {
        const expr = "firstName == 'John'";
        const exp = await crs.binding.expression.compile(expr, null, {
            ctxName: "custom"
        });

        assertEquals(exp.parameters.expression, "custom.firstName == 'John'");
    })

    it ("string literals", async () => {
        const expr = "${firstName} is ${age} old";
        const exp = await crs.binding.expression.compile(expr);

        assertEquals(exp.parameters.expression, "${context.firstName} is ${context.age} old");
    })

    it ("release null - don't fall over", async () => {
        assertEquals(crs.binding.expression.release(null), undefined);
    })
})