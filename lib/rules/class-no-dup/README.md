# class-no-dup

Disallow the duplication of a classname inside the `class` attribute.

The following patterns are considered violations:

```html
  <div class="foo bar foo"></div>
```

```html
  <div class="bar bar"></div>
```

The following patterns are not considered violations:

```html
  <div class="foo bar"></div>
```
