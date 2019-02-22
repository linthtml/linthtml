# doctype-first

If set, the first element in the file **must** be `<!DOCTYPE ... >` (excluding comments and whitespace).

The following patterns are considered violations:

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

```html
<html>
  <head>
    ...
  </head>
  <body>
    ...
  <boby>
<html>
<!DOCTYPE html>
```

The following patterns are not considerd violations:

```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    ...
  <boby>
</html>
```
