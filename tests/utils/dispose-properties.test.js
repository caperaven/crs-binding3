import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

describe("dispose properties tests", async () => {
    it("standard cleanup", async () => {
        const obj = {
            person: {
                firstName: "John"
            },
            addresses: [
                {
                    street: "Street 1"
                }
            ]
        }

        const person = obj.person;
        const address = obj.addresses;

        await crs.binding.utils.disposeProperties(obj);
        assert(person.firstName == null);
        assert(address.length == 0);
        assert(obj.person == null);
        assert(obj.address == null);
    })

    it ("skip auto dispose", async () => {
        const obj = {
            autoDispose: false,
            person: {
                firstName: "John"
            }
        }

        await crs.binding.utils.disposeProperties(obj);
        assertEquals(obj.person.firstName, "John");
    })

    it("dispose null", async () => {
        const obj = undefined;

        await crs.binding.utils.disposeProperties(obj);
        assert(obj == null);
    })

    it ("skip dispose of frozen objects", async () => {
        const obj = Object.freeze({
            person: "John"
        });

        await crs.binding.utils.disposeProperties(obj);
        assertEquals(obj.person, "John");
    })
})