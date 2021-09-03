# focusable-tabindex-style

If set, all focusable elements must have a negative or 0 `tabindex` attribute, if any.
Focusable elements are :

- natively focusable elements (`button`, `input`, `select`, `textarea`)
- `a`, `area` elements with an href value

_Reasoning: [W3C, WCAG 2.0](w3.org/wiki/HTML/Usage/tabindex)_

The following patterns are considered violations:

```html
<button tabindex="1">Button</button>
```

```html
<a href="#" tabindex="12">Link</a>
```

The following patterns are not considered violations:

```html
<button tabindex="0">Button</button>
```

```html
<a href="#" tabindex="-1">Link</a>
```
