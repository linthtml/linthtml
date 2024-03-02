# head-valid-content-model

If set, the content-model of the HEAD element will be enforced, only `base`, `link`, `meta`, `noscript`, `script`, `style`, `template` and `title` tags are legal children.

The following patterns are considered violations:

```html
<head>
  <div>Content</div>
</head>
```

```html
<head>
  <button>A button</button>
</head>
```

The following patterns are not considered violations:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="initial-scale=1, maximum-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <title>Title</title>
  <link rel="icon" type="image/png" href="/favicon.ico">
</head>
```
