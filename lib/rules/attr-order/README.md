# attr-order

Specify the order of attribues in HTML tag.

# Options

["class", "of", "attributes"]

Given:

```
  "attr-order": ["class", "id"]
```

The following patterns are considered violations:

```html
  <button id="foo" class="bar"></button>
```

The following patterns are not considered violations:

```html
  <button class="foo" id="bar"></button>
```
