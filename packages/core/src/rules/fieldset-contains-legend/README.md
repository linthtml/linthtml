# fieldset-contains-legend

See [WCAG technique H71](https://www.w3.org/TR/WCAG20-TECHS/H71.html): Each `fieldset` element should contain a `legend` element.

The following patterns are considered violations:

```html
  <fieldset></fieldset>
```

```html
  <fieldset>
    <h3>Legend</h3>
  </fieldset>
```

The following patterns are not considered violations:

```html
  <fieldset>
    <legend>Foo</legend>
  </fieldset>
```
