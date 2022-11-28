import { beforeAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";
import {ElementMock} from "../mockups/element-mock.js";

await init();

beforeAll(async () => {
    await import("./../../src/events/event-emitter.js");
});

describe("event emitter tests", async () => {
    it ("multiple callbacks on single event key", async () => {
        const f1 = () => {};
        const f2 = () => {};

        await crs.binding.events.emitter.on("test", f1);
        await crs.binding.events.emitter.on("test", f2);

        const events = crs.binding.events.emitter.events.test;
        assertEquals(events[0], f1);
        assertEquals(events[1], f2);

        await crs.binding.events.emitter.remove("test", f1);
        assertEquals(events[0], f2);

        await crs.binding.events.emitter.remove("test", f2);
        assertEquals(events.length, 0);
    })

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

    it ("emit multiple", async () => {
        let count = 0;
        const element = document.createElement("div");

        await crs.binding.events.emitter.on("test-count", () => count += 1);
        await crs.binding.events.emitter.on("test-count", () => count += 1);

        await crs.binding.events.emitter.emit("test-count");

        assertEquals(count, 2);
    })
})
