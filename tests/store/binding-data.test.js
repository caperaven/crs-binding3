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
        const definition = { name: "test", fields: {} }
        const id = crs.binding.data.addObject("add context");
        await crs.binding.data.addDataDefinition(id, definition);

        const data = crs.binding.data.getData(id);
        assertEquals(data.definitions["test"], definition);
        await crs.binding.data.remove(id);
    })

    it ("setIssue", async () => {
        const id = crs.binding.data.addObject("test");
        const errorUUID = await crs.binding.data.setIssue(id, "person.firstName", "first name is required");
        const data = crs.binding.data.getData(id);

        assertEquals(data.issues["person.firstName"][errorUUID].message, "first name is required");
        await crs.binding.data.remove(id);
    })

    it ("getIssues", async () => {
        const id = crs.binding.data.addObject("test");
        const errorUUID = await crs.binding.data.setIssue(id, "person.firstName", "error 1");
        const warningUUID = await crs.binding.data.setIssue(id, "person.firstName", "warning 1", null, "warning");

        assert(errorUUID != null);
        assert(warningUUID != null);

        const errors = await crs.binding.data.getIssues(id, "person.firstName");
        const warnings = await crs.binding.data.getIssues(id, "person.firstName", "warning");
        const all = await crs.binding.data.getIssues(id, "person.firstName", "all");

        assertEquals(errors.issues.length, 1);
        assertEquals(errors.issues[0].message, "error 1");

        assertEquals(warnings.issues.length, 1);
        assertEquals(warnings.issues[0].message, "warning 1");

        assertEquals(all.issues.length, 2);
        assertEquals(all.issues[0].message, "error 1");
        assertEquals(all.issues[1].message, "warning 1");
        await crs.binding.data.remove(id);
    })

    it ("has issues", async () => {
        const id = crs.binding.data.addObject("test");
        await crs.binding.data.setIssue(id, "person.firstName", "error 1");
        await crs.binding.data.setIssue(id, "person.firstName", "warning 1", null, "warning");

        const hasErrors = await crs.binding.data.hasIssues(id, "person.firstName");
        const hasWarnings = await crs.binding.data.hasIssues(id, "person.firstName", "warning");

        assertEquals(hasErrors, true);
        assertEquals(hasWarnings, true);
        await crs.binding.data.remove(id);
    })

    it ("get elements for errors", async () => {
        const id = crs.binding.data.addObject("test");

        await crs.binding.data.addCallback(id, "person.firstName", "uuid")
        await crs.binding.data.setIssue(id, "person.firstName", "error 1", "uuid");

        const elements = await crs.binding.data.getIssueElements(id, "person.firstName");
        assertEquals(elements.length, 1);
        assertEquals(elements[0], "uuid");
        await crs.binding.data.remove(id);
    });

    it ("removeIssues", async () => {
        const id = crs.binding.data.addObject("test");
        const uuid = await crs.binding.data.setIssue(id, "person.firstName", "error 1", "uuid");
        const issues = await crs.binding.data.getIssues(id, "person.firstName");
        assert(issues != null);

        await crs.binding.data.removeIssues(id, [uuid]);
        const clearedIssues = await crs.binding.data.getIssues(id, "person.firstName");
        assertEquals(clearedIssues.issues.length, 0);
        await crs.binding.data.remove(id);
    })

    it ("clearIssues", async () => {
        const id = crs.binding.data.addObject("test");
        await crs.binding.data.setIssue(id, "person.firstName", "error 1", "uuid");
        await crs.binding.data.clearIssues(id);
        const issues = await crs.binding.data.getIssues(id, "person.firstName");
        assertEquals(issues, undefined);

        const data = crs.binding.data.getData(id);
        assertEquals(data.issues, {});
        await crs.binding.data.remove(id);
    });

    it ("create with default", async () => {
        const definition = {
            "name": "model",
            "fields": {
                "firstName": {
                    "dataType": "string",
                    "default": "John"
                },
                "lastName": {
                    "dataType": "string",
                    "default": "Doe"
                },
                "age": {
                    "dataType": "number",
                    "default": 20
                },
                "location": {}
            }
        }

        const id = crs.binding.data.addObject("test");
        await crs.binding.data.addDataDefinition(id, definition);

        const model = await crs.binding.data.create(id, "person", "model");
        const person = await crs.binding.data.getProperty(id, "person");

        assertEquals(model.firstName, "John");
        assertEquals(model.lastName, "Doe");
        assertEquals(model.age, 20);
        assertEquals(model.location, null);

        assertEquals(model, person);

        await crs.binding.data.remove(id);
    })

    it ("validate defaults", async () => {
        const definition = {
            "name": "person",
            "fields": {
                "firstName": {
                    "dataType": "string",
                    "default": "John"
                },
                "lastName": {
                    "dataType": "string",
                    "default": "Doe"
                },
                "age": {
                    "dataType": "number",
                    "default": 20,

                    "conditionalDefaults": [
                        {
                            "conditionExpr": "person.firstName == 'Jane'",
                            "value": 30
                        }
                    ]
                },
                "location": {
                    "dataType": "string",
                    "default": "RSA",

                    "conditionalDefaults": [
                        {
                            "conditionExpr": "person.firstName == 'Jane' && isActive == true",
                            "true_value": "UK",
                            "false_value": "DE"
                        }
                    ]
                }
            }
        }

        const id = crs.binding.data.addObject("test");
        await crs.binding.data.addDataDefinition(id, definition);

        const callbacks = await crs.binding.data.getCallbacks(id, "person.firstName");

        assert(definition.fields.location.conditionalDefaults == null);
        assert(callbacks.length === 2);

        let location;
        let age;

        await crs.binding.data.setProperty(id, "person.firstName", "Jane");
        location = await crs.binding.data.getProperty(id, "person.location");
        age = await crs.binding.data.getProperty(id, "person.age");
        assert(location === "DE");
        assert(age === 30);

        await crs.binding.data.setProperty(id, "isActive", true);
        location = await crs.binding.data.getProperty(id, "person.location");
        assert(location === "UK");
    })
})