# attr-bans

Specify a list of disallowed HTML attributes.

## Options

The rule accept the following formats as configuration:

- `["array", "of", "unwanted", "attributes"]`
- `"attributes"`
- `/regex/`
- `[/regex/]`

By default the rule disallow the following attibutes:

```js
[
  "align",
  "background",
  "bgcolor",
  "border",
  "frameborder",
  "longdesc",
  "marginwidth",
  "marginheight",
  "scrolling",
  "style",
  "width"
]
```

Given the default value, the following patterns are considered violations:

```html
  <p center>Content</p>
```

```html
  <div bgcolor="red">Content</p>
```

The following patterns are not considered violations:

```html
  <p class="text-center">Content</p>
```
