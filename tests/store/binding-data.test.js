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

    it ("add object", async () => {
        const obj = { property: "test" }
        const id = crs.binding.data.addObject("add object", obj);

        assertEquals(crs.binding.data.getProperty(id, "property"), "test");

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

    it ("add data definition", async () => {
        const definition = { name: "test" }
        const id = crs.binding.data.addObject("add context");
        await crs.binding.data.addDataDefinition(id, definition);

        const data = crs.binding.data.getData(id);
        assertEquals(data.definitions["test"], definition);
    })

    it ("setIssue", async () => {
        const id = crs.binding.data.addObject("test");
        const errorUUID = await crs.binding.data.setIssue(id, "person.firstName", "first name is required");
        const data = crs.binding.data.getData(id);

        assertEquals(data.issues["person.firstName"][errorUUID].message, "first name is required");
    })
})