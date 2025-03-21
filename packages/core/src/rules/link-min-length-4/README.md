# link-min-length-4

_This rule is deprecated and will be removed in LintHTML v1. Use rule [link-label-min-length](../link-label-min-length/README.md) instead._

A rule inspired by [WCAG Technique G91: Providing link text that describes the purpose of a link](https://www.w3.org/WAI/WCAG22/Techniques/general/G91.html)
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
