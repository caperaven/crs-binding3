import { beforeAll, afterAll, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./mockups/init.js";
import {ElementMock} from "./mockups/element-mock.js";

await init();

beforeAll(async () => {
    await crs.binding.translations.add({
        buttons: {
            save: "Save"
        }
    });

    await crs.binding.translations.add({
        labels: {
            code: "Code"
        }
    }, "ctx");
})

afterAll(async () => {
    await crs.binding.translations.delete("ctx");
})

describe("translations tests", async () => {
    it("add, get and delete - translate", async () => {
        assertEquals(await crs.binding.translations.get("buttons.save"), "Save");
        assertEquals(await crs.binding.translations.get("ctx.labels.code"), "Code");
    })

    it("translate element", async () => {
        const element = new ElementMock("div");
        const child = new ElementMock("div", null, element);
        child.textContent = "&{ctx.labels.code}";

        element.setAttribute("data-value", "&{buttons.save}");

        await crs.binding.translations.parseElement(element);

        assertEquals(element.children[0].textContent, "Code");
        assertEquals(element.getAttribute("data-value"), "Save");
    })
})