import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../mockups/init.js";

await init();

describe("parse elements tests", async () => {
    it ("parse elements", async () => {
        const parent = document.createElement("ul");
        parent.appendChild(document.createElement("li"));

        assertEquals(await crs.binding.parsers.parseElements(parent.children), undefined);
    })
})