# id-no-dup

Disallow the duplication of an id inside an html file.

The following patterns are considered violations:

```html
  <div id="foo"></div>
  <div id="foo"></div>
```

```html
  <div id="foo">
    <div id="foo"></div>
  </div>
```

The following patterns are not considered violations:

```html
  <div id="foo"></div>
  <div id="bar"></div>
```

```html
  <div id="foo">
    <div id="bar"></div>
  </div>
```
