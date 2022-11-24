import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../mockups/init.js";

await init();

describe("binding data store tests", async () => {
    it ("add object", async () => {
        const id = crs.binding.data.addObject("add object");
        const dataObj = crs.binding.data.getData(id);

        assert(id > -1);
        assert(typeof dataObj.data == "object");
        assertEquals(dataObj.name, "add object");
        assertEquals(dataObj.type, "data");

        await crs.binding.data.remove(id);
        assertEquals(crs.binding.data.getData(id), undefined);
        assertEquals(crs.binding.data.getContext(id), undefined);
    })

    it ("add context", async () => {
        const context = {};
        const id = crs.binding.data.addObject("add context");
        crs.binding.data.addContext(id, context);
        assertEquals(crs.binding.data.getContext(id), context);

        await crs.binding.data.remove(id);
        assertEquals(crs.binding.data.getData(id), undefined);
        assertEquals(crs.binding.data.getContext(id), undefined);
    })

    it ("set and get property", async () => {
        const id = crs.binding.data.addObject("properties");
        crs.binding.data.setProperty(id, "person.firstName", "John");
        assertEquals(crs.binding.data.getProperty(id,"person.firstName"), "John");

        await crs.binding.data.remove(id);
        assertEquals(crs.binding.data.getData(id), undefined);
        assertEquals(crs.binding.data.getContext(id), undefined);
    })
})