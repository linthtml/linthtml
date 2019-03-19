# attr-req-value

If set, attribute values cannot be empty."

_⚠️ This does not disallow the value `""`._

_⚠️Boolean attributes such as `hidden` and `checked` do not require values, but no attribute may have an equals sign but no value after it, like `<div class=></div>`, as this is invalid html._

The following patterns are considered violations:

```html
  <button id= ></button>
```

```html
  <button id= class="bar" ></button>
```

```html
  <button class></button>
```

The following patterns are not considered violations:

```html
  <button class="foo"></button>
```

```html
  <button disabled></button>
```
