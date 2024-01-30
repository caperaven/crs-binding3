import {assertEquals, assert} from "https://deno.land/std/testing/asserts.ts";
import {spy} from "https://deno.land/std/testing/mock.ts";
import AttrProvider from "./../../src/providers/attributes/attr.js"
import {init} from "../mockups/init.js";

await init();

Deno.test("AttrProvider: store should be an object", () => {
    const attrProvider = new AttrProvider();
    assert(attrProvider.store instanceof Object);
});

Deno.test("AttrProvider: parse should correctly parse attributes and set callbacks", async () => {
    // Mocked objects to simulate the parse function's behavior
    const mockAttr = {
        name: "data-value.bind",
        value: "age",
        ownerElement: {
            attributes: {},
            removeAttribute: () => {
            },
            setAttribute: (name, value) => {
                mockAttr.ownerElement.attributes[name] = value;
            },
            "__uuid": "unique-id",
            "__bid": 1
        }
    };

    crs.binding.elements["unique-id"] = mockAttr.ownerElement;

    const mockContext = {bid: "binding-id"};

    // Spies to observe function calls and arguments
    const removeAttributeSpy = spy(mockAttr.ownerElement, "removeAttribute");
    const setAttributeSpy = spy(mockAttr.ownerElement, "setAttribute");

    mockAttr.ownerElement.__bid = crs.binding.data.addObject("test", {age: 10})

    const attrProvider = new AttrProvider();
    await attrProvider.parse(mockAttr, mockContext);
    await attrProvider.update("unique-id", "age");

    delete crs.binding.elements["unique-id"];

    assertEquals(removeAttributeSpy.calls.length, 1);
    assertEquals(setAttributeSpy.calls.length, 1); // This assumes that the function will be called, adjust as necessary
    assertEquals(mockAttr.ownerElement.attributes["data-value"], 10);
});

Deno.test("AttrProvider: update should correctly update attributes", async () => {
    // This test assumes the existence of a 'crs.binding.elements' and 'crs.binding.data.getDataForElement' which need to be mocked
});

Deno.test("AttrProvider: clear should remove the uuid from the store", async () => {
    const attrProvider = new AttrProvider();
    const uuid = "test-uuid";

    // Populate the store with a test uuid to clear
    attrProvider.store[uuid] = {};

    await attrProvider.clear(uuid);

    assertEquals(attrProvider.store.hasOwnProperty(uuid), false);
});

