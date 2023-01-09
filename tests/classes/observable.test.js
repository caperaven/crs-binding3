import { assert } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import {beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {init} from "../mockups/init.js";

await init();

beforeAll(async () => {
    globalThis.Observable = (await import("./../../src/classes/observable.js")).Observable;
});

Deno.test("Observable: addEventListener", () => {
    const observable = new Observable();
    const listener = () => {};
    observable.addEventListener("event", listener);
    assert(observable.events.find(item => item.event === "event") != null);
});

Deno.test("Observable: removeEventListener", () => {
    const observable = new Observable();
    const listener = () => {};
    observable.addEventListener("event", listener);
    observable.removeEventListener("event", listener);
    assert(observable.events.find(item => item.event === "event") == null);
});

Deno.test("Observable: notify", () => {
    const observable = new Observable();
    let called = false;
    const listener = () => (called = true);
    observable.addEventListener("event", listener);
    observable.notify("event");
    assert(called);
});

Deno.test("Observable: dispose", () => {
    const observable = new Observable();
    const listener = () => {};
    observable.addEventListener("event", listener);
    observable.dispose();
    assert(observable.events.length == 0);
});

Deno.test("Observable: with details", () => {
    const observable = new Observable();
    let details;
    const listener = (event) => { details = event.detail };
    observable.addEventListener("event", listener);
    observable.notify("event", {code: "A"});
    assert(details.code == "A");
});
