# title-no-dup

If set, the `<title>` tag must not appear twice in the head.

The following patterns are considered violations:

```html
<head>
  <title>Page title</title>
  <title>Page title</title>
</head>
```

The following patterns are not considered violations:

```html
<head>
  <title>Page title</title>
</head>
```
