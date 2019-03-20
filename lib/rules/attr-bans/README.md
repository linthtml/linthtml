# attrs-bans

Specify a blacklist of disallowed HTML attributes.

## Options

`array`: `["array", "of", "unwanted", "attributes"]

Default:

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
