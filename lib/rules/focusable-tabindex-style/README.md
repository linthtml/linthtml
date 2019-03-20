# focusable-tabindex-style

If set, all focusable elements (`a`, `area`, `button`, `input`, `img`, `select`, `textarea`) must have a positive `tabindex` attribute, if any.

_Reasoning: [IITAA, 10.3 and 10.4](http://www.dhs.state.il.us/IITAA/IITAAWebImplementationGuidelines.html)_

The following patterns are considered violations:

```html
<button tabindex="-1">Button</button>
```

```html
<a href="#" tabindex="-12">Link</a>
```

The following patterns are not considered violations:

```html
<button tabindex="0">Button</button>
```

```html
<a href="#" tabindex="12">Link</a>
```
