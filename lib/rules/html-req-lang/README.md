# html-req-lang

If set, each `html` tag must have a `lang` attribute.

The following patterns are considered violations:

```html
<html lang="">
```

```html
<html>
```

The following patterns are not considered violations:

```html
<html lang="FR" >
```
