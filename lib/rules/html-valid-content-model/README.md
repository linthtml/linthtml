# html-valid-content-model

If set, the content-model of the `html` element will be enforced: at most one `head` and one `body` tag may appear, in that order. No other tags are allowed.

The following patterns are considered violations:

```html
<html>
  <head>
    ...
  </head>
  <main>
    ...
  <main>
</html>
```

```html
<html>
  <body>
    ...
  <body>
  <head>
    ...
  </head>
</html>
```

The following patterns are not considered violations:

```html
<html>
  <head>
    ...
  </head>
  <body>
    ...
  <boby>
</html>
```
