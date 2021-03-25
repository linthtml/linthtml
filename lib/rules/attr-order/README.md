# attr-order

Specify the order of attributes in HTML tag.

## Options

There rule accept as configuration an array of strings (example: ["class", "of", "attributes"]).

Given:

```js
  "attr-order": [
    "error",
    ["class", "id"]
  ]
```

The following patterns are considered violations:

```html
  <button id="foo" class="bar"></button>
```

The following patterns are not considered violations:

```html
  <button class="foo" id="bar"></button>
```
