# head-req-title

If set, the `head` tag must contain a non-empty `title` tag.

The following patterns are considered violations:

```html
<head>
  <title></title>
</head>
```

```html
<head>
</head>
```

The following patterns are not considered violations:

```html
<head>
  <title>Titre</title>
</head>
```
