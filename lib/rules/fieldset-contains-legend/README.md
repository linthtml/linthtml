# fiedset-contains-legend

WCAG rule [73](http://oaa-accessibility.org/wcag20/rule/73/): Each `fieldset` element should contain a `legend` element.

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
