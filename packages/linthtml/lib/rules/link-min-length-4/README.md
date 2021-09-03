# link-min-length-4

A rule from WCAG http://oaa-accessibility.org/wcag20/rule/38/.
Report errors if link's text content is less than 4 characters long.

The following patterns are considered violations:

```html
  <a>A</a
```

```html
  <a aria-label="A"></a
```

The following patterns are not considered violations:

```html
  <a>A link</a
```

```html
  <a aria-label="A link"></a>
```
