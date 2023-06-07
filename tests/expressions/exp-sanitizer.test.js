import {beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import {init} from "../mockups/init.js";

await init();

let sanitize;

beforeAll(async () => {
    sanitize = (await import("../../src/expressions/exp-sanitizer.js")).sanitize;
});

Deno.test("sanitize - with translation", async () => {
    const result = await sanitize("${value} is &{translation}");
    assertEquals(result.expression, "${context.value} is ${await crs.binding.translations.get('translation')}");
})

Deno.test("sanitize - globals variable", async () => {
    const result = await sanitize("$globals.menu.isVisible = !$globals.menu.isVisible");
    assertEquals(result.expression, "crs.binding.data.globals.menu.isVisible = !crs.binding.data.globals.menu.isVisible");
    assertEquals(result.properties.length, 1);
    assertEquals(result.properties[0], "$globals.menu.isVisible");
})

Deno.test("sanitize - exp = context", async () => {
    assertEquals((await sanitize("color", "color")).expression, "color");
    assertEquals((await sanitize("${color}", "color")).expression, "${color}");
})

Deno.test("sanitize - single assignment expression", async () => {
    const result = await sanitize("value1 == value2");
    assertEquals(result.expression, "context.value1 == context.value2");
    assertEquals(result.properties[0], "value1");
    assertEquals(result.properties[1], "value2");
});

Deno.test("sanitize - single assignment expression", async () => {
    const result = await sanitize("value1 === value2");
    assertEquals(result.expression, "context.value1 === context.value2");
    assertEquals(result.properties[0], "value1");
    assertEquals(result.properties[1], "value2");
});

Deno.test("sanitize - single", async () => {
    const result = await sanitize("name");
    assertEquals(result.properties[0], "name");
    assertEquals(result.expression, "context.name");
});

Deno.test("sanitize - simple", async () => {
    const result = await sanitize("property1 == 'a'");
    assertNotEquals(result.properties.indexOf("property1"), "-1");
    assertEquals(result.expression, "context.property1 == 'a'");
    assertEquals(result.isLiteral, false);
});

Deno.test("sanitize - with function", async () => {
    const result = await sanitize("property1.toUpper() == 'A'");
    assertNotEquals(result.properties.indexOf("property1"), "-1");
    assertEquals(result.expression, "context.property1.toUpper() == 'A'");
    assertEquals(result.isLiteral, false);
});

Deno.test("sanitize - composite", async () => {
    const result = await sanitize("${model.name} is ${model.age} old");
    assertEquals(result.properties[0], "model.name");
    assertEquals(result.properties[1], "model.age");
    assertEquals(result.expression, "${context.model.name} is ${context.model.age} old");
    assertEquals(result.isLiteral, true);
});

Deno.test("sanitize - expression", async () => {
    const result = await sanitize("${1 + 1 + property1}");
    assertEquals(result.properties[0], "property1");
    assertEquals(result.expression, "${1 + 1 + context.property1}");
    assertEquals(result.isLiteral, true);
});

Deno.test("sanitize - multiple functions", async () => {
    const result = await sanitize("${firstName.trim().toLowerCase()} > ${lastName.trim().toLowerCase()}");
    assertEquals(result.expression, "${context.firstName.trim().toLowerCase()} > ${context.lastName.trim().toLowerCase()}");
    assertEquals(result.properties[0], "firstName");
    assertEquals(result.properties[1], "lastName");
    assertEquals(result.isLiteral, true);
});

Deno.test("sanitize - conditional value", async () => {
    const result = await sanitize("title == 'a' ? true : false");
    assertEquals(result.expression, "context.title == 'a' ? true : false");
    assertEquals(result.properties.length, 1);
    assertEquals(result.properties[0], "title");
});

Deno.test("sanitize - path", async () => {
    const result = await sanitize("address.street");
    assertEquals(result.expression, "context.address.street");
    assertEquals(result.properties[0], "address.street");
});

Deno.test("sanitize - special string", async () => {
    const result = await sanitize("value == 'v-height'");
    assertEquals(result.expression, "context.value == 'v-height'");
});

Deno.test("sanitize - when", async () => {
    const result = await sanitize("firstName == 'John' && lastName == 'Doe'");
    assertEquals(result.expression, "context.firstName == 'John' && context.lastName == 'Doe'");
    assertEquals(result.properties[0], "firstName");
    assertEquals(result.properties[1], "lastName");
});

Deno.test("sanitize - string token", async () => {
    const result = await sanitize("${firstName} ${lastName} is ${age} old and lives at \"${address.street}\"");
    assertEquals(result.expression, "${context.firstName} ${context.lastName} is ${context.age} old and lives at \"${context.address.street}\"")
    assertEquals(result.properties[0], "firstName");
    assertEquals(result.properties[1], "lastName");
    assertEquals(result.properties[2], "age");
    assertEquals(result.properties[3], "address.street");
});

Deno.test("sanitize - ignore named expression", async () => {
    const result = await sanitize("person.firstName", "person");
    assertEquals(result.expression, "person.firstName");
    assertEquals(result.properties[0], "firstName");
});

Deno.test("sanitize - ignore named expression - multiple", async () => {
    const result = await sanitize("person.firstName && person.lastName", "person");
    assertEquals(result.expression, "person.firstName && person.lastName");
    assertEquals(result.properties[0], "firstName");
    assertEquals(result.properties[1], "lastName");
});

Deno.test("sanitize - ignore null", async () => {
    const result = await sanitize("validation.editing == null", "context");
    assertEquals(result.expression, "context.validation.editing == null");
    assertEquals(result.properties[0], "validation.editing");
});

Deno.test("sanitize - array in expression", async () => {
    const result = await sanitize("arrayfield != null || arrayfield.length == 0", "person");
    assertEquals(result.expression, "person.arrayfield != null || person.arrayfield.length == 0");
    assertEquals(result.properties[0], "arrayfield");
    assertEquals(result.properties[1], "arrayfield.length");
});

Deno.test("sanitize - array in expression", async () => {
    const result = await sanitize("arrayfield.length == 0 || arrayfield.length == 5", "person");
    assertEquals(result.expression, "person.arrayfield.length == 0 || person.arrayfield.length == 5");
    assertEquals(result.properties[0], "arrayfield.length");
    assertEquals(result.properties.length, 1);
});

Deno.test("sanitize - set object", async () => {
    const result = await sanitize("$globals.date = {title: ${title}}");
    assertEquals(result.expression, "crs.binding.data.globals.date = {title: ${context.title}}");
    assertEquals(result.properties[0], "$globals.date");
    assertEquals(result.properties[1], "title");
});

Deno.test("sanitize - set object with event", async () => {
    const result = await sanitize("{ x: $event.x, y: $event.y }");
    assertEquals(result.expression, "{ x: event.x, y: event.y }");
    assertEquals(result.properties.length, 0);
});

Deno.test("sanitize - toggle boolean", async () => {
    const result = await sanitize("$context.isOpen = !$context.isOpen");
    assertEquals(result.expression, "context.isOpen = !context.isOpen");
});

Deno.test("sanitize - !$context.expression", async () => {
    const result = await sanitize("!$context.isOpen");
    assertEquals(result.expression, "!context.isOpen");
});

Deno.test("sanitize - !expression", async () => {
    const result = await sanitize("${!isOpen}");
    assertEquals(result.expression, "${!context.isOpen}");
});

Deno.test("sanitize - $event.target", async () => {
    const result = await sanitize("$event.target");
    assertEquals(result.expression, "event.target");
    assertEquals(result.properties.length, 0);
});

Deno.test("sanitize - $parentId in expression", async () => {
    const result = await sanitize("$parent.property1 == item.property2", "item");
    assertEquals(result.expression, "parent.property1 == item.property2");

    assertEquals(result.properties[0], "$parent.property1");
    assertEquals(result.properties[1], "property2");
});

Deno.test("sanitize - $data", async () => {
    const result = await sanitize("selectedObj = $data($event.target.dataset.id)");
    assertEquals(result.expression, "context.selectedObj = crs.binding.data.getValue(event.target.dataset.id)");
    assertEquals(result.properties.length, 1);
    assertEquals(result.properties[0], "selectedObj");
});

Deno.test("sanitize - inner-text", async () => {
    const result = await sanitize("This is the ${item.position} article", "item");
    assertEquals(result.expression, "This is the ${item.position} article");
    assertEquals(result.properties[0], "position");
});

Deno.test("sanitize - keywords", async () => {
    let result = await sanitize("true");
    assertEquals(result.expression, "true");

    result = await sanitize("false");
    assertEquals(result.expression, "false");

    result = await sanitize("null");
    assertEquals(result.expression, "null");

    result = await sanitize(true);
    assertEquals(result.expression, true);

    result = await sanitize(false);
    assertEquals(result.expression, false);

    result = await sanitize(null);
    assertEquals(result.expression, null);

    result = await sanitize(10);
    assertEquals(result.expression, 10);

    result = await sanitize("10");
    assertEquals(result.expression, "10");

})

Deno.test("sanitize - expression with (....)", async () => {
    const result = await sanitize("model.monitoringPointTriggerExpressionId != null || (model.status == 'CancelledByUser' || model.status == 'CancelledBySystem' || model.status == 'Closed')");
    assertEquals(result.expression, "context.model.monitoringPointTriggerExpressionId != null || (context.model.status == 'CancelledByUser' || context.model.status == 'CancelledBySystem' || context.model.status == 'Closed')");
    assertEquals(result.properties.length, 2);
    assertEquals(result.properties[0], "model.monitoringPointTriggerExpressionId");
    assertEquals(result.properties[1], "model.status");
});

Deno.test("sanitize - expression with (...) simple combined with function", async () => {
    const result = await sanitize("(model.property.isValid() == true)");
    assertEquals(result.expression, "(context.model.property.isValid() == true)");
    assertEquals(result.properties[0], "model.property");
})

Deno.test("sanitize - expression with (...) simple combined with function and parameters", async () => {
    const result = await sanitize("(model.property.isValid('abc', 10) == true)");
    assertEquals(result.expression, "(context.model.property.isValid('abc', 10) == true)");
    assertEquals(result.properties[0], "model.property");
})

Deno.test("sanitize - expression with (()) simple", async () => {
    const result = await sanitize("(model.isOpen == true) || (model.isOpen == null)");
    assertEquals(result.expression, "(context.model.isOpen == true) || (context.model.isOpen == null)");
    assertEquals(result.properties[0], "model.isOpen");
})

Deno.test("sanitize - expression with (()) complex", async () => {
    const result = await sanitize("((model.isOpen == true) || (model.isOpen == null))");
    assertEquals(result.expression, "((context.model.isOpen == true) || (context.model.isOpen == null))");
    assertEquals(result.properties[0], "model.isOpen");
})

Deno.test("sanitize - function", async () => {
    const result = await sanitize("`rotate(${angle}deg)`");
    assertEquals(result.expression, "`rotate(${context.angle}deg)`");
    assertEquals(result.properties[0], "angle");
})

Deno.test("sanitize - calculated string", async () => {
    const result = await sanitize("`${(rect.x / 2)}px ${(rect.y / 2)}px`");
    assertEquals(result.expression, "`${(context.rect.x / 2)}px ${(context.rect.y / 2)}px`");
    assertEquals(result.properties[0], "rect.x");
    assertEquals(result.properties[1], "rect.y");
})

Deno.test("sanitize - html", async () => {
    const result = await sanitize("$html.model.property");
    assertEquals(result.isHTML, true);
    assertEquals(result.expression, "context.model.property");
})

Deno.test("sanitize - expression", async () => {
    const result = await sanitize("${model.siteCode == 'A21' ? 'Hello A21' : model.code}");
    assertEquals(result.expression, "${context.model.siteCode == 'A21' ? 'Hello A21' : context.model.code}");
})

Deno.test("sanitize - expression literal", async () => {
    const result = await sanitize("`${model.siteCode == 'A21' ? 'Hello A21' : model.code}`");
    assertEquals(result.expression, "`${context.model.siteCode == 'A21' ? 'Hello A21' : context.model.code}`");
})

Deno.test("sanitize - Not expressions", async () => {
    const result = await sanitize("!isActive");
    assertEquals(result.expression, "!context.isActive");
})

Deno.test("sanitize - Not expressions on path", async () => {
    const result = await sanitize("!model.isActive");
    assertEquals(result.expression, "!context.model.isActive");
})

Deno.test("sanitize - Not expressions in literals", async () => {
    const result = await sanitize("`!model.isActive`");
    assertEquals(result.expression, "`!context.model.isActive`");
})

Deno.test("sanitize - Not expressions in expressions", async () => {
    const result = await sanitize("!isActive && !isOn");
    assertEquals(result.expression, "!context.isActive && !context.isOn");
})

Deno.test("sanitize - Not expression with prefix", async () => {
    const result = await sanitize("!$globals.isActive");
    assertEquals(result.expression, "!crs.binding.data.globals.isActive")
})

Deno.test("sanitize - Bracket array check", async () => {
    const result = await sanitize("(schema.variable.items || []).length == 0)");
    assertEquals(result.expression, "(context.schema.variable.items || []).length == 0)");
})

Deno.test("sanitize - attribute condition", async () => {
    const result = await sanitize("${$context.item.value == true ? '#checked' : '#unchecked'}", "item");
    assertEquals(result.expression, "${context.item.value == true ? '#checked' : '#unchecked'}");
})

Deno.test("sanitize - context condition expression", async () => {
    const result = await sanitize("context.isDialog == true ? true : false");
    assertEquals(result.expression, "context.context.isDialog == true ? true : false");
})

Deno.test("sanitize - if true property", async () => {
    const result = await sanitize("columnSpan != null ? columnSpan : ''");
    assertEquals(result.expression, "context.columnSpan != null ? context.columnSpan : ''");
})

Deno.test("sanitize - if false property", async () => {
    const result = await sanitize("columnSpan != null ? '' : defaultSpan");
    assertEquals(result.expression, "context.columnSpan != null ? '' : context.defaultSpan");
})

Deno.test("sanitize - object literal", async () => {
    const result = await sanitize("Selected Person Value: ${selectedPerson}");
    assertEquals(result.expression, "Selected Person Value: ${context.selectedPerson}");
})

Deno.test("sanitize - function on context", async () => {
    const result = await sanitize("getInitialValue('code')");
    assertEquals(result.expression, "context.getInitialValue('code')");
})

Deno.test("sanitize - composite string", async () => {
    const result = await sanitize("Selected Animal Value: ${selectedAnimal}");
    assertEquals(result.expression, "Selected Animal Value: ${context.selectedAnimal}");
})

Deno.test("sanitize - new keyword", async () => {
    const result = await sanitize("${new Date().toLocaleDateString() === date.toLocaleDateString() ? '0': tabindex == null ? '-1': tabindex}");
    assertEquals(result.expression, "${new Date().toLocaleDateString() === context.date.toLocaleDateString() ? '0': context.tabindex == null ? '-1': context.tabindex}");
})

Deno.test("sanitize - case complex", async () => {
    const result = await sanitize("current == false: 'non-current-day', new Date().toLocaleDateString() === date.toLocaleDateString(): 'today'");
    assertEquals(result.expression, "context.current == false: 'non-current-day', new Date().toLocaleDateString() === context.date.toLocaleDateString(): 'today'");
})

Deno.test("sanitize - model and context mix", async () =>{
    const result = await sanitize("model.firstName == 'Jane' && $context.isActive == true");
    assertEquals(result.expression, "context.model.firstName == 'Jane' && context.isActive == true");
})