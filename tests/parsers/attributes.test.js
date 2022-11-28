import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../mockups/init.js";

await init();

describe("parse attributes tests", async () => {
    it ("parse attributes", async () => {
        assertEquals(await crs.binding.parsers.parseAttributes({}), undefined);

        const element = document.createElement("div");
        element.setAttribute("data-value", "value");

        assertEquals(await crs.binding.parsers.parseAttributes(element), undefined);
    })
})