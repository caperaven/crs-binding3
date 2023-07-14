# Context Property Events

## Introduction

The purpose of this is to allow binding expressions based on context property changes.
All the normal actions can take place.

1. emit
2. post
3. setvalue
4. call
5. process

## Left side of the expression

```html
<component title.changed.call="[test-component].refresh(title)"></component> <!-- my title context property -->
```

in this example we are using title.changed.call
This has three parts.

1. the keyword ".changed." this indicates that the change provider must parse this for further processing.
2. the left side of the keyword is the property on the components binding context to monitor.
3. the right side defines the kind of action to take when the property changes.

## Attribute value
The attribute value is the same as it has been for any of the actions.

## Parameters
Additionally, we want to add support for some parameter expressions

1. $context.title - use the over arching context property called title
2. $data.title - use the data context property called title

## Context Triggers

```html
<context-triggers
    title-changed.post="message-key[test-component (value = title)]">
    title-changed.post.if="title == 'test' ? message-key[test-component (value = title)] : ...">
</context-triggers>
```

Custom action triggers will be defined like this on the over arching context