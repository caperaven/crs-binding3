import "./../../src/managers/inflation-manager.js";

export default class InflationManagerViewModel extends crs.classes.ViewBase {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async load() {
        await crs.binding.inflation.manager.register("test", this.template);
    }

    async disconnectedCallback() {
        await crs.binding.inflation.manager.unregister("test");
    }

    async add() {
        const data = []
        for (let i = 0; i < 10; i++) {
            data.push(createRandomPerson());
        }

        const elements = await crs.binding.inflation.manager.get("test", data, this.collection.children);
        this.collection.innerHTML = "";
        this.collection.append(...elements);
    }
}

function createRandomPerson() {
    return {
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        age: ages[Math.floor(Math.random() * ages.length)]
    }
}

const firstNames = ["John", "Jane", "Bob", "Mary", "Joe", "Sue", "Tom", "Sally", "Bill", "Sarah"];
const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson"];
const ages = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];