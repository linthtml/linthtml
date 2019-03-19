# tag-close

If set, tags must be closed.

The following patterns are considered violations:

```html
<div>
  <p> content......</p>
<div>
```

The following patterns are not considered violations:

```html
<div>
  <p> content......</p>
</div>
```

# tag-name-match

If set, tag names must match (including case).

The following patterns are considered violations:

```html
<body></Body>
```

The following patterns are considered violations:

```html
<body></body>
```

# tag-self-close

Define how void element must be closed.

## Options

Possible values :

* `"always"`: Void elements must be self-closed with `/` (html4 style).',
* `"never"`: Void elements must not be self-closed with `/` (html5 style).',
* `false`: No restriction.",

_The void elements are `area`, `base`, `br`, `col`, `embed`, `hr`, `img`, `input`, `keygen`, `link`, `menuitem`, `meta`, `param`, `source`, `track` and `wbr`._
