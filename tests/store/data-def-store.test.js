import { describe, it, beforeAll, beforeEach, afterEach } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertExists, assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../mockups/init.js";

await init();

beforeAll(async () => {
    await import("../../src/store/data-def-store.js");
});

describe("data def store tests", () => {
    let bid;

    beforeEach(() => {
        bid = crs.binding.data.addObject("test");
    });

    afterEach(() => {
        crs.binding.data.remove(bid);
    })


    it ("initialized", () => {
        assertExists(crs.binding.dataDef);
    });

    it ("add data def", async () => {
        const def = {
            testId: "testId",
            name: "person",
            fields: {}
        };
        await crs.binding.dataDef.register(bid, def);

        assertExists(crs.binding.dataDef.store[bid]);
        assertEquals(crs.binding.dataDef.store[bid]["person"].testId, "testId");

        await crs.binding.dataDef.unRegister(bid);
        assert(crs.binding.dataDef.store[bid] == null);
    })

    it ("create new model", async () => {
        const def = {
            name: "person",
            fields: {
                firstName: {
                    dataType: "string",
                    default: "John"
                },
                lastName: {
                    dataType: "string",
                    default: "Doe"
                },
                age: {
                    dataType: "number",
                    default: 20
                }
            }
        };
        await crs.binding.dataDef.register(bid, def);
        await crs.binding.dataDef.create(bid, "person");

        const model = crs.binding.data.getProperty(bid, "person");
        assertEquals(model.firstName, "John");
        assertEquals(model.lastName, "Doe");
        assertEquals(model.age, 20);

        await crs.binding.dataDef.unRegister(bid);
    })

    it ("create new model with conditional defaults", async () => {
        const def = {
            name: "person",
            fields: {
                firstName: {
                    dataType: "string",
                    default: "John"
                },
                lastName: {
                    dataType: "string",
                    default: "Doe",

                    conditionalDefaults: [
                        {
                            conditionExpr: "person.firstName == 'Jane'",
                            value: "Smith"
                        }
                    ]
                },
                age: {
                    dataType: "number",
                    default: 20,

                    conditionalDefaults: [
                        {
                            conditionExpr: "person.firstName == 'Jane' && person.lastName == 'Smith'",
                            value: 25
                        }
                    ]
                }
            }
        };

        await crs.binding.dataDef.register(bid, def);
        await crs.binding.data.setProperty(bid, "person.firstName", "Jane");

        const model = crs.binding.data.getProperty(bid, "person");
        assertEquals(model.firstName, "Jane");
        assertEquals(model.lastName, "Smith");
        assertEquals(model.age, 25);

        await crs.binding.dataDef.unRegister(bid);
    });
});