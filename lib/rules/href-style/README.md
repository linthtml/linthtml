# href-style

If set, the content of the `href` attribute must follow the specified format.

## Options

Possible values :

* `"absolute"`: All `href` attribute must use absolute URLs.
* `"relative"`: All `href` attribute must use relative URLs.
* `false`: No restriction.

_Links to fragments (those starting with `#`) are not checked._

Given:

```
  "href-style": "relative"
```

The following patterns are considered violations:

```html
  <a href="https://github.com/">Link</a>
```

```html
  <a href="http://localhost:4200/">Link</a>
```

The following patterns are not considerd violations:

```html
  <a href="/page">Link</a>
```
