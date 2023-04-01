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
            data.push(createRandomPerson(i));
        }

        const elements = await crs.binding.inflation.manager.get("test", data, this.collection.children);
        this.collection.innerHTML = "";
        this.collection.append(...elements);
    }
}

function createRandomPerson(id) {
    return {
        id,
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        age: ages[Math.floor(Math.random() * ages.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
    }
}

const firstNames = ["John", "Jane", "Bob", "Mary", "Joe", "Sue", "Tom", "Sally", "Bill", "Sarah"];
const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson"];
const ages = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const colors = ["red", "green", "blue", "yellow", "orange", "purple", "black", "white", "gray", "brown", "pink", "cyan", "magenta", "lime", "olive", "maroon", "navy", "teal", "aqua", "fuchsia", "silver", "gold", "indigo", "violet", "coral", "azure", "beige", "bisque", "blanchedalmond", "blueviolet", "burlywood", "cadetblue", "chartreuse", "chocolate", "cornflowerblue", "cornsilk", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "gainsboro", "ghostwhite", "gold", "goldenrod", "greenyellow", "honeydew", "hotpink", "indianred", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "limegreen", "linen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "oldlace", "olivedrab", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise"]