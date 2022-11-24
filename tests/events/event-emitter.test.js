import { beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";
import {ElementMock} from "../mockups/element-mock.js";

await init();

beforeAll(async () => {
    await import("./../../src/events/event-emitter.js");
});

describe("event emitter tests", async () => {
    it ("postMessage", async () => {
        let message = null;
        const element = document.createElement("div");
        element.onMessage = (args) => message = args;
        document.appendChild(element);

        await crs.binding.events.emitter.postMessage("div", "test");
        assertEquals(message, "test");
    })

    it ("on, emit and remove", async () => {
        let message = null;

        const fn = (args) => message = args;
        await crs.binding.events.emitter.on("test", fn);
        await crs.binding.events.emitter.emit("test", "test");
        await crs.binding.events.emitter.remove("test", fn);
        assertEquals(message, "test");

        message = null;
        await crs.binding.events.emitter.emit("test", "test");
        assertEquals(message, null);
    })
})
