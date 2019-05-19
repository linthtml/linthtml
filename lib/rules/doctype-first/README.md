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

## Options

You can pass the "smart" as value for the rule. This value allow the none presence of a `<!DOCTYPE ... >` but only if the tag `<head>` is not present.

Given :

```
  "doctype-first": "smart"
```

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
<section>
  ...
</section>
```
