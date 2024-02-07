import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {OptionalChainActions} from "../../src/utils/optional-chain-actions.js";

describe("Optional Chain Actions", () => {
    it("indexOf with spaces", async () => {
        const exp = "model?.object?.property === 'value' ? 'yes' : 'no'";
        const result = OptionalChainActions.indexOf(exp);
        assertEquals(result, 34);
    })

    it("indexOf with no spaces", async () => {
        const exp = "model?.object?.property==='value'?'yes':'no'";
        const result = OptionalChainActions.indexOf(exp);
        assertEquals(result, 31);
    })

    it("split with spaces", async () => {
        const exp = "model?.object?.property === 'value' ? 'yes' : 'no'";
        const result = OptionalChainActions.split(exp);
        assertEquals(result[0], "model?.object?.property === 'value'")
        assertEquals(result[1], "'yes' : 'no'")
    })

    it("split with no spaces", async () => {
        const exp = "model?.object?.property==='value'?'yes':'no'";
        const result = OptionalChainActions.split(exp);
        assertEquals(result[0], "model?.object?.property==='value'")
        assertEquals(result[1], "'yes':'no'")
    })


    it("hasTernary true", async () => {
        const exp = "model?.object?.property === 'value' ? 'yes' : 'no'";
        const result = OptionalChainActions.hasTernary(exp);
        assertEquals(result, true);
    })

    it("hasTernary true", async () => {
        const exp = "model?.object?.property === 'value'";
        const result = OptionalChainActions.hasTernary(exp);
        assertEquals(result, false);
    })
})