import { beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../mockups/init.js";
import {ElementMock} from "../mockups/element-mock.js";

await init();

describe("call provider tests", async () => {
    let element;
    let provider;
    let context;
    let message;

    beforeEach(async () => {
        message = null;

        context = {
            bid: 1,
            log: () => {
                message = "log";
            }
        }

        crs.binding.data.addContext(1, context);

        element = new ElementMock("div");
        const child = new ElementMock("div", "child", element);
        child["setAttribute"]("click.call", "log");

        provider = await crs.binding.providers.getAttrProvider(".call");
        await crs.binding.parsers.parseElement(element, context);
    })

    afterEach(() => {
        crs.binding.providers.clear([element]);
        element = null;
    })

    it("init", async () => {
        assert(crs.binding.eventStore.store.click != null);
    })

    it("click", async () => {
        assert(crs.binding.eventStore.store.click != null);

        await document.performEvent("click", element.children[0], {type: "click", composedPath: () => [element.children[0]]});
        assertEquals(message, "log");
    })
})