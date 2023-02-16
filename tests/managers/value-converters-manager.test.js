import {describe, it, beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import {init} from "../mockups/init.js";
import {alphaNumericConverter} from "./alphaNumericConverter.js";

await init();

beforeAll(async () => {
    await import("./../../src/managers/value-converters-manager.js");
});

describe("value converters manager tests", async () => {
    it ("crud", async () => {
        assertEquals(crs.binding.valueConvertersManager.get("an"), undefined);

        await crs.binding.valueConvertersManager.add("an", alphaNumericConverter);
        assertEquals(crs.binding.valueConvertersManager.get("an"), alphaNumericConverter);

        await crs.binding.valueConvertersManager.remove("an");
        assertEquals(crs.binding.valueConvertersManager.get("an"), undefined);
    });

    it ("convert", async () => {
        await crs.binding.valueConvertersManager.add("an", alphaNumericConverter);
        assertEquals(crs.binding.valueConvertersManager.convert("a", "an", "set"), 1);
        assertEquals(crs.binding.valueConvertersManager.convert(1, "an", "get"), "a");
        await crs.binding.valueConvertersManager.remove("an");
    })
});
