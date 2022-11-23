import { assertEquals, assertNotEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import {sanitize} from "../../src/expressions/exp-sanitizer.js"

Deno.test("sanitize - globals variable", () => {
    const result = sanitize("$globals.menu.isVisible = !$globals.menu.isVisible");
    assertEquals(result.expression, "crsbinding.data.globals.menu.isVisible = !crsbinding.data.globals.menu.isVisible");
    assertEquals(result.properties.length, 1);
    assertEquals(result.properties[0], "$globals.menu.isVisible");
})

Deno.test("sanitize - exp = context", () => {
    assertEquals(sanitize("color", "color").expression, "color");
    assertEquals(sanitize("${color}", "color").expression, "${color}");
})

Deno.test("sanitize - single assignment expression", () => {
    const result = sanitize("value1 == value2");
    assertEquals(result.expression, "context.value1 == context.value2");
    assertEquals(result.properties[0], "value1");
    assertEquals(result.properties[1], "value2");
});

Deno.test("sanitize - single assignment expression", () => {
    const result = sanitize("value1 === value2");
    assertEquals(result.expression, "context.value1 === context.value2");
    assertEquals(result.properties[0], "value1");
    assertEquals(result.properties[1], "value2");
});

Deno.test("sanitize - single", () => {
    const result = sanitize("name");
    assertEquals(result.properties[0], "name");
    assertEquals(result.expression, "context.name");
});

Deno.test("sanitize - simple", () => {
    const result = sanitize("property1 == 'a'");
    assertNotEquals(result.properties.indexOf("property1"), "-1");
    assertEquals(result.expression, "context.property1 == 'a'");
    assertEquals(result.isLiteral, false);
});

Deno.test("sanitize - with function", () => {
    const result = sanitize("property1.toUpper() == 'A'");
    assertNotEquals(result.properties.indexOf("property1"), "-1");
    assertEquals(result.expression, "context.property1.toUpper() == 'A'");
    assertEquals(result.isLiteral, false);
});

Deno.test("sanitize - composite", () => {
    const result = sanitize("${model.name} is ${model.age} old");
    assertEquals(result.properties[0], "model.name");
    assertEquals(result.properties[1], "model.age");
    assertEquals(result.expression, "${context.model.name} is ${context.model.age} old");
    assertEquals(result.isLiteral, true);
});

Deno.test("sanitize - expression", () => {
    const result = sanitize("${1 + 1 + property1}");
    assertEquals(result.properties[0], "property1");
    assertEquals(result.expression, "${1 + 1 + context.property1}");
    assertEquals(result.isLiteral, true);
});

Deno.test("sanitize - multiple functions", () => {
    const result = sanitize("${firstName.trim().toLowerCase()} > ${lastName.trim().toLowerCase()}");
    assertEquals(result.expression, "${context.firstName.trim().toLowerCase()} > ${context.lastName.trim().toLowerCase()}");
    assertEquals(result.properties[0], "firstName");
    assertEquals(result.properties[1], "lastName");
    assertEquals(result.isLiteral, true);
});

Deno.test("sanitize - conditional value", () => {
    const result = sanitize("title == 'a' ? true : false");
    assertEquals(result.expression, "context.title == 'a' ? true : false");
    assertEquals(result.properties.length, 1);
    assertEquals(result.properties[0], "title");
});

Deno.test("sanitize - path", () => {
    const result = sanitize("address.street");
    assertEquals(result.expression, "context.address.street");
    assertEquals(result.properties[0], "address.street");
});

Deno.test("sanitize - special string", () => {
    const result = sanitize("value == 'v-height'");
    assertEquals(result.expression, "context.value == 'v-height'");
});

Deno.test("sanitize - when", () => {
    const result = sanitize("firstName == 'John' && lastName == 'Doe'");
    assertEquals(result.expression, "context.firstName == 'John' && context.lastName == 'Doe'");
    assertEquals(result.properties[0], "firstName");
    assertEquals(result.properties[1], "lastName");
});

Deno.test("sanitize - string token", () => {
    const result = sanitize("${firstName} ${lastName} is ${age} old and lives at \"${address.street}\"");
    assertEquals(result.expression, "${context.firstName} ${context.lastName} is ${context.age} old and lives at \"${context.address.street}\"")
    assertEquals(result.properties[0], "firstName");
    assertEquals(result.properties[1], "lastName");
    assertEquals(result.properties[2], "age");
    assertEquals(result.properties[3], "address.street");
});

Deno.test("sanitize - ignore named expression", () => {
    const result = sanitize("person.firstName", "person");
    assertEquals(result.expression, "person.firstName");
    assertEquals(result.properties[0], "firstName");
});

Deno.test("sanitize - ignore named expression - multiple", () => {
    const result = sanitize("person.firstName && person.lastName", "person");
    assertEquals(result.expression, "person.firstName && person.lastName");
    assertEquals(result.properties[0], "firstName");
    assertEquals(result.properties[1], "lastName");
});

Deno.test("sanitize - ignore null", () => {
    const result = sanitize("validation.editing == null", "context");
    assertEquals(result.expression, "context.validation.editing == null");
    assertEquals(result.properties[0], "validation.editing");
});

Deno.test("sanitize - array in expression", () => {
    const result = sanitize("arrayfield != null || arrayfield.length == 0", "person");
    assertEquals(result.expression, "person.arrayfield != null || person.arrayfield.length == 0");
    assertEquals(result.properties[0], "arrayfield");
    assertEquals(result.properties[1], "arrayfield.length");
});

Deno.test("sanitize - array in expression", () => {
    const result = sanitize("arrayfield.length == 0 || arrayfield.length == 5", "person");
    assertEquals(result.expression, "person.arrayfield.length == 0 || person.arrayfield.length == 5");
    assertEquals(result.properties[0], "arrayfield.length");
    assertEquals(result.properties.length, 1);
});

Deno.test("sanitize - set object", () => {
    const result = sanitize("$globals.date = {title: ${title}}");
    assertEquals(result.expression, "crsbinding.data.globals.date = {title: ${context.title}}");
    assertEquals(result.properties[0], "$globals.date");
    assertEquals(result.properties[1], "title");
});

Deno.test("sanitize - set object with event", () => {
    const result = sanitize("{ x: $event.x, y: $event.y }");
    assertEquals(result.expression, "{ x: event.x, y: event.y }");
    assertEquals(result.properties.length, 0);
});

Deno.test("sanitize - toggle boolean", () => {
    const result = sanitize("$context.isOpen = !$context.isOpen");
    assertEquals(result.expression, "context.isOpen = !context.isOpen");
});

Deno.test("sanitize - !$context.expression", () => {
    const result = sanitize("!$context.isOpen");
    assertEquals(result.expression, "!context.isOpen");
});

Deno.test("sanitize - !expression", () => {
    const result = sanitize("${!isOpen}");
    assertEquals(result.expression, "${!context.isOpen}");
});

Deno.test("sanitize - $event.target", () => {
    const result = sanitize("$event.target");
    assertEquals(result.expression, "event.target");
    assertEquals(result.properties.length, 0);
});

Deno.test("sanitize - $parentId in expression", () => {
    const result = sanitize("$parent.property1 == item.property2", "item");
    assertEquals(result.expression, "parent.property1 == item.property2");

    assertEquals(result.properties[0], "$parent.property1");
    assertEquals(result.properties[1], "property2");
});

Deno.test("sanitize - $data", () => {
    const result = sanitize("selectedObj = $data($event.target.dataset.id)");
    assertEquals(result.expression, "context.selectedObj = crsbinding.data.getValue(event.target.dataset.id)");
    assertEquals(result.properties.length, 1);
    assertEquals(result.properties[0], "selectedObj");
});

Deno.test("sanitize - inner-text", () => {
    const result = sanitize("This is the ${item.position} article", "item");
    assertEquals(result.expression, "This is the ${item.position} article");
    assertEquals(result.properties[0], "position");
});

Deno.test("sanitize - keywords", () => {
    let result = sanitize("true");
    assertEquals(result.expression, "true");

    result = sanitize("false");
    assertEquals(result.expression, "false");

    result = sanitize("null");
    assertEquals(result.expression, "null");

    result = sanitize(true);
    assertEquals(result.expression, true);

    result = sanitize(false);
    assertEquals(result.expression, false);

    result = sanitize(null);
    assertEquals(result.expression, null);

    result = sanitize(10);
    assertEquals(result.expression, 10);

    result = sanitize("10");
    assertEquals(result.expression, "10");

})

Deno.test("sanitize - expression with (....)", () => {
    const result = sanitize("model.monitoringPointTriggerExpressionId != null || (model.status == 'CancelledByUser' || model.status == 'CancelledBySystem' || model.status == 'Closed')");
    assertEquals(result.expression, "context.model.monitoringPointTriggerExpressionId != null || (context.model.status == 'CancelledByUser' || context.model.status == 'CancelledBySystem' || context.model.status == 'Closed')");
    assertEquals(result.properties.length, 2);
    assertEquals(result.properties[0], "model.monitoringPointTriggerExpressionId");
    assertEquals(result.properties[1], "model.status");
});

Deno.test("sanitize - expression with (...) simple combined with function", () => {
    const result = sanitize("(model.property.isValid() == true)");
    assertEquals(result.expression, "(context.model.property.isValid() == true)");
    assertEquals(result.properties[0], "model.property");
})

Deno.test("sanitize - expression with (...) simple combined with function and parameters", () => {
    const result = sanitize("(model.property.isValid('abc', 10) == true)");
    assertEquals(result.expression, "(context.model.property.isValid('abc', 10) == true)");
    assertEquals(result.properties[0], "model.property");
})

Deno.test("sanitize - expression with (()) simple", () => {
    const result = sanitize("(model.isOpen == true) || (model.isOpen == null)");
    assertEquals(result.expression, "(context.model.isOpen == true) || (context.model.isOpen == null)");
    assertEquals(result.properties[0], "model.isOpen");
})

Deno.test("sanitize - expression with (()) complex", () => {
    const result = sanitize("((model.isOpen == true) || (model.isOpen == null))");
    assertEquals(result.expression, "((context.model.isOpen == true) || (context.model.isOpen == null))");
    assertEquals(result.properties[0], "model.isOpen");
})

Deno.test("sanitize - function", () => {
    const result = sanitize("`rotate(${angle}deg)`");
    assertEquals(result.expression, "`rotate(${context.angle}deg)`");
    assertEquals(result.properties[0], "angle");
})

Deno.test("sanitize - calculated string", () => {
    const result = sanitize("`${(rect.x / 2)}px ${(rect.y / 2)}px`");
    assertEquals(result.expression, "`${(context.rect.x / 2)}px ${(context.rect.y / 2)}px`");
    assertEquals(result.properties[0], "rect.x");
    assertEquals(result.properties[1], "rect.y");
})

Deno.test("sanitize - html", () => {
    const result = sanitize("$html.model.property");
    assertEquals(result.isHTML, true);
    assertEquals(result.expression, "context.model.property");
})

Deno.test("sanitize - expression", () => {
    const result = sanitize("${model.siteCode == 'A21' ? 'Hello A21' : model.code}");
    assertEquals(result.expression, "${context.model.siteCode == 'A21' ? 'Hello A21' : context.model.code}");
})

Deno.test("sanitize - expression literal", () => {
    const result = sanitize("`${model.siteCode == 'A21' ? 'Hello A21' : model.code}`");
    assertEquals(result.expression, "`${context.model.siteCode == 'A21' ? 'Hello A21' : context.model.code}`");
})

Deno.test("sanitize - Not expressions", () => {
    const result = sanitize("!isActive");
    assertEquals(result.expression, "!context.isActive");
})

Deno.test("sanitize - Not expressions on path", () => {
    const result = sanitize("!model.isActive");
    assertEquals(result.expression, "!context.model.isActive");
})

Deno.test("sanitize - Not expressions in literals", () => {
    const result = sanitize("`!model.isActive`");
    assertEquals(result.expression, "`!context.model.isActive`");
})

Deno.test("sanitize - Not expressions in expressions", () => {
    const result = sanitize("!isActive && !isOn");
    assertEquals(result.expression, "!context.isActive && !context.isOn");
})

Deno.test("sanitize - Not expression with prefix", () => {
    const result = sanitize("!$globals.isActive");
    assertEquals(result.expression, "!crsbinding.data.globals.isActive")
})

Deno.test("sanitize - Bracket array check", () => {
    const result = sanitize("(schema.variable.items || []).length == 0)");
    assertEquals(result.expression, "(context.schema.variable.items || []).length == 0)");
})

Deno.test("sanitize - attribute condition", () => {
    const result = sanitize("${$context.item.value == true ? '#checked' : '#unchecked'}", "item");
    assertEquals(result.expression, "${context.item.value == true ? '#checked' : '#unchecked'}");
})

Deno.test("sanitize - context condition expression", () => {
    const result = sanitize("context.isDialog == true ? true : false");
    assertEquals(result.expression, "context.context.isDialog == true ? true : false");
})

Deno.test("sanitize - if true property", () => {
    const result = sanitize("columnSpan != null ? columnSpan : ''");
    assertEquals(result.expression, "context.columnSpan != null ? context.columnSpan : ''");
})

Deno.test("sanitize - if false property", () => {
    const result = sanitize("columnSpan != null ? '' : defaultSpan");
    assertEquals(result.expression, "context.columnSpan != null ? '' : context.defaultSpan");
})

Deno.test("sanitize - object literal", () => {
    const result = sanitize("Selected Person Value: ${selectedPerson}");
    assertEquals(result.expression, "Selected Person Value: ${context.selectedPerson}");
})

Deno.test("sanitize - function on context", () => {
    const result = sanitize("getInitialValue('code')");
    assertEquals(result.expression, "context.getInitialValue('code')");
})

Deno.test("sanitize - composite string", () => {
    const result = sanitize("Selected Animal Value: ${selectedAnimal}");
    assertEquals(result.expression, "Selected Animal Value: ${context.selectedAnimal}");
})