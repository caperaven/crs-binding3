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

        crs.binding.utils.disposeProperties(obj);

        assert(Object.keys(obj).length == 0);
    })

    it ("skip auto dispose", async () => {
        const obj = {
            autoDispose: false,
            person: {
                firstName: "John"
            }
        }

        crs.binding.utils.disposeProperties(obj);
        assertEquals(obj.person.firstName, "John");
    })

    it("dispose null", async () => {
        const obj = undefined;

        crs.binding.utils.disposeProperties(obj);
        assert(obj == null);
    })

    it ("skip dispose of frozen objects", async () => {
        const obj = Object.freeze({
            person: "John"
        });

        crs.binding.utils.disposeProperties(obj);
        assertEquals(obj.person, "John");
    })
})