import "./../../src/store/data-def-store.js";
import {model_def} from "./definitions/model-def.js";
import {person_def} from "./definitions/person-def.js";
import {context_def} from "./definitions/context-def.js";

export default class DataDefinitionViewMode extends crs.classes.ViewBase {
    async preLoad() {
        await crs.binding.dataDef.register(this.bid, context_def);
        await crs.binding.dataDef.register(this.bid, model_def);
        await crs.binding.dataDef.register(this.bid, person_def);

        await crs.binding.dataDef.create(this.bid, "person");
        await crs.binding.dataDef.create(this.bid, "model");
    }
}