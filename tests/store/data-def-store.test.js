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
            fields: {}
        };
        await crs.binding.dataDef.register("test", def);

        assertEquals(crs.binding.dataDef.store["test"], def);
        assertEquals(crs.binding.dataDef.get("test"), def);

        await crs.binding.dataDef.unRegister("test");
        assert(crs.binding.dataDef.store["test"] == null);
    })

    it ("create new model", async () => {
        const def = {
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
        await crs.binding.dataDef.register("test", def, "model");
        await crs.binding.dataDef.create(bid, "model", "test");

        const model = crs.binding.data.getProperty(bid, "model");
        assertEquals(model.firstName, "John");
        assertEquals(model.lastName, "Doe");
        assertEquals(model.age, 20);

        await crs.binding.dataDef.unRegister("test");
    })

    it ("create new model with conditional defaults", async () => {
        const def = {
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
                            conditionExpr: "model.firstName == 'Jane'",
                            value: "Smith"
                        }
                    ]
                },
                age: {
                    dataType: "number",
                    default: 20,

                    conditionalDefaults: [
                        {
                            conditionExpr: "model.firstName == 'Jane' && model.lastName == 'Smith'",
                            value: 25
                        }
                    ]
                }
            }
        };

        await crs.binding.dataDef.register("test", def, "model");
        await crs.binding.data.setProperty(bid, "model.firstName", "Jane", "test");
        await crs.binding.dataDef.unRegister("test");
    });
});