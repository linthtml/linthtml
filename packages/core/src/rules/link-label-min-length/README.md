# link-label-min-length

A rule from WCAG https://www.w3.org/WAI/WCAG22/Techniques/general/G91.html.
Enforce a minimum length for a link text.

Given the following rule setting:

```json
"link-label-min-length": ["error", 4]
```

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
