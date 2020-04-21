# focusable-tabindex-style

If set, all focusable elements must have a negative or 0 `tabindex` attribute, if any.
Focusable elements are :

- natively focusable elements (`button`, `input`, `select`, `textarea`)
- `a`, `area` elements with an href value

_Reasoning: [IITAA, 10.3 and 10.4](http://www.dhs.state.il.us/IITAA/IITAAWebImplementationGuidelines.html)_

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
