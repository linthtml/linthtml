# img-req-alt

An `<img>` without an alt attribute is essentially invisible to assistive/accessibility technology (i.e. screen readers). In order to ensure that screen readers can provide useful information, we need to ensure that all `<img>` elements have an alt attribute specified.

## Options

Possible values :

* `true`: Each `img` tag must have a non-empty `alt` property.
* `"allownull"`: Each `img` tag must have an `alt` property with a value, but value may be null (equal to `""`). _⚠️ consider not using this setting as it's bad for accessibility, use `role="presentation" instead`_
* `false`: No restriction

The following patterns are considered violations:

```html
<img src="cat.png">
```

The following patterns are not considerd violations:

```html
<img src="cat.png" alt="picture of cat">
```

## References

* See [WCAG Suggestion H37](https://www.w3.org/TR/WCAG20-TECHS/H37.html)
