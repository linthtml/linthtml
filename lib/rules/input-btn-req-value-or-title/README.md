# input-btn-req-value-or-title

A rule from WCAG http://oaa-accessibility.org/wcag20/rule/77/ Input elements where type=[button|submit|reset] must have a value or title attribute.

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
