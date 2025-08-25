## no-deprecated-tag

If set, disallow the use of [obsolete and deprecated html tags](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements#obsolete_and_deprecated_elements)

Given:

```json
  {
    "no-deprecated-tag": "error"
  }
```

The following patterns are considered violations:

```html
<center>Centered html</center>
```

```html
<dir><li>Folder</li></dir>
```

```html
<big>Big text</big>
```

The following patterns are not considered violations:

```html
<div>A simple div</div>
```

```html
<span>A simple span</span>
```

```html
<strong>A simple strong</strong>
```

```html
<button>A simple button</button>
```
