import { beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../mockups/init.js";
import {ElementMock} from "../mockups/element-mock.js";

await init();

describe("post provider tests", async () => {
    let element;
    let provider;
    let context;
    let messageArgs;

    beforeEach(async () => {
        messageArgs = null;

        context = {
            bid: 1
        }

        crs.binding.data.addContext(1, context);

        element = new ElementMock("div", "parent", document);

        element.onMessage = (args)=> {
            console.log(args);
            messageArgs = args
        }

        document.querySelectorAll = ()=> [element];
    })

    afterEach(() => {
        crs.binding.providers.clear([element]);
        element = null;
    })

    it("init", async () => {
        const child = new ElementMock("div", "child", element);
        child["setAttribute"]("click.post", "upload['div#parent']");

        provider = await crs.binding.providers.getAttrProvider(".post");
        await crs.binding.parsers.parseElement(element, context);
        assert(crs.binding.eventStore.store.click != null);
    })

    it("post - without parameters", async () => {
        const child = new ElementMock("div", "child", element);
        child["setAttribute"]("click.post", "download['div#parent']");

        provider = await crs.binding.providers.getAttrProvider(".post");
        await crs.binding.parsers.parseElement(element, context);

        await document.performEvent("click", element.children[0], {type: "click", composedPath: () => [element.children[0]]});
        assertEquals(messageArgs.key, "download");
    })

    it("post - with parameters", async () => {

        const child = new ElementMock("div", "child", element);
        child["setAttribute"]("click.post", "upload['div#parent'](firstName='John', lastName='Doe')");

        provider = await crs.binding.providers.getAttrProvider(".post");
        await crs.binding.parsers.parseElement(element, context);

        await document.performEvent("click", element.children[0], {type: "click", composedPath: () => [element.children[0]]});
        assertEquals(messageArgs.key, "upload");
        assertEquals(messageArgs.firstName, "John");
        assertEquals(messageArgs.lastName, "Doe");
    })
})