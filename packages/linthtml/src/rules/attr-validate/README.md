# attr-validate

If set, attributes in a tag must be well-formed.

The following patterns are considered violations:

```html
  <div id= ></div>
```

```html
  <div class="large id="title"></div>
```

```html
  <div class=="a"></div>
```

The following patterns are not considered violations:

```html
  <div class="foo"></div>
```

```html
  <div disabled></div>
```
