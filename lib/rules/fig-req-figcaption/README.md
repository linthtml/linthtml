# fig-req-figcaption

Enforce the presence of the tag `<figcaption>` inside a `<figure>` tag.

The following patterns are considered violations:

```html
<figure>
  <img src="image.jpg" alt="" />
  <h2>Legend</h2>
</figure>
```

```html
<div>
  <img src="image.jpg" alt="" />
  <figcaption>Legend</ficaption>
</div>
```

The following patterns are not considered violations:

```html
<figure>
  <img src="image.jpg" alt="" />
  <figcaption>Legend</ficaption>
</figure>
```
