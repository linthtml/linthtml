# attr-no-dup

Disallow duplications of HTML attributes within the same tag.

The following patterns are considered violations:

```html
  <a href="index.html" href="about.html">Link</a>
```

The following patterns are not considered violations:

```html
  <a href="index.html">Link</a>
```
