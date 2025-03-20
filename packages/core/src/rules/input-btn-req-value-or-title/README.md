# input-btn-req-value-or-title

A rule from [WCAG H32: Providing submit buttons](https://www.w3.org/TR/WCAG20-TECHS/H32.html): Input elements with type=[button|submit|reset] must have a value or title attribute.

The following patterns are considered violations:

```html
  <input type="button">
  <input type="submit">
  <input type="reset">
```

```html
  <input type="button" aria-label="">
  <input type="button" value="">
  <input type="button" title="">
```

The following patterns are not considered violations:

```html
  <input type="button" aria-label="Click me">
  <input type="submit" value="Submit">
  <input type="reset" title="reset">
```
