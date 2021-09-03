# img-req-src

If set, a source must be given for each `<img>` tag.

The following patterns are considered violations:

```html
<img alt="" class="foo">
```

The following patterns are not considerd violations:

```html
<img src="cat.png" alt="picture of cat">
```
