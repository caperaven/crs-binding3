import { beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";
import {ElementMock} from "../mockups/element-mock.js";

await init();

beforeAll(async () => {
    await import("./../../src/events/dom-events.js");
});

describe("dom event tests", async () => {
    it ("enable and disable events on element", async () => {
        const element = new ElementMock("div");

        crs.binding.dom.enableEvents(element);
        assert(element["registerEvent"] != null);
        assert(element["unregisterEvent"] != null);
        assert(element["_domEvents"] != null);

        crs.binding.dom.disableEvents(element);
        assert(element["registerEvent"] == null);
        assert(element["unregisterEvent"] == null);
        assert(element["_domEvents"] == null);
    });

    it ("add and remove events", async () => {
        const callback = () => {};
        const element = new ElementMock("div");
        crs.binding.dom.enableEvents(element);

        element.registerEvent(element, "click", callback);
        assertEquals(element._domEvents.length, 1);
        assertEquals(element._domEvents[0].element, element);
        assertEquals(element._domEvents[0].event, "click");
        assertEquals(element._domEvents[0].callback, callback);

        element.unregisterEvent(element, "click", callback);
        assertEquals(element._domEvents.length, 0);

        crs.binding.dom.disableEvents(element);
    })

    it ("remove events on disable", async () => {
        const callback = () => {};
        const element = new ElementMock("div");
        crs.binding.dom.enableEvents(element);

        element.registerEvent(element, "click", callback);
        assertEquals(element._domEvents.length, 1);
        assertEquals(element._domEvents[0].element, element);
        assertEquals(element._domEvents[0].event, "click");
        assertEquals(element._domEvents[0].callback, callback);

        crs.binding.dom.disableEvents(element);
        assertEquals(element.registerEvent, undefined);
        assertEquals(element.unregisterEvent, undefined);
        assertEquals(element._domEvents, undefined);

        crs.binding.dom.disableEvents(element);
    })
})
