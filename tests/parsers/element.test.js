import { beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../mockups/init.js";
import {ElementMock} from "../mockups/element-mock.js";

await init();

describe("parse element tests", async () => {
    it ("parse ignore element", async () => {
        const ignoreStyleElement = new ElementMock("style", null, null, true);
        const ignoreScriptElement = new ElementMock("script", null, null, true);
        const ignoreTemplateElement = new ElementMock("template", null, null, true);

        await crs.binding.parsers.parseElement(ignoreStyleElement, { bid: 0 });
        await crs.binding.parsers.parseElement(ignoreScriptElement, { bid: 0 });
        await crs.binding.parsers.parseElement(ignoreTemplateElement, { bid: 0 });

        assertEquals(ignoreStyleElement["__uuid"], undefined);
        assertEquals(ignoreScriptElement["__uuid"], undefined);
        assertEquals(ignoreTemplateElement["__uuid"], undefined);

        assertEquals(ignoreStyleElement["__bid"], undefined);
        assertEquals(ignoreScriptElement["__bid"], undefined);
        assertEquals(ignoreTemplateElement["__bid"], undefined);
    })

    it ("element parser", async () => {
        const element = new ElementMock("test");
        element.setAttribute("click.call", "fn");

        await crs.binding.parsers.parseElement(element, { bid: 0 }, { ctxName: "context" });
        assert(element["__uuid"] != null);
        assertEquals(element["__bid"], 0);
    })

    it ("parse children", async () => {
        const element = new ElementMock("ul");
        const li = new ElementMock("li", null, element);
        li.setAttribute("click.call", "fn");

        await crs.binding.parsers.parseElement(element, { bid: 0 });

        assert(element["__uuid"] == null);
        assert(element["__bid"] == null);
        assert(li["__uuid"] != null);
        assertEquals(li["__bid"], 0);
    })

    it ("skip inflated", async () => {
        const element = new ElementMock("div");
        element["__inflated"] = true;

        assertEquals(await crs.binding.parsers.parseElement(element, { bid: 0 }), undefined);
    })
})