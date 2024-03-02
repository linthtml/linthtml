# link-req-noopener

If set, each `a` tag with `target="_blank"` must have a `rel="noopener"` or `rel="noreferrer"` attribute.

The following patterns are considered violations:

```html
<a href='link' target="_blank">A link</a>
```

The following patterns are not considered violations:

```html
<a href='link' target="_blank" rel="noopener">A link</a>
```

```html
<a href='link' target="_blank" rel="noreferrer">A link</a>
```
