# spec-char-escape

If set, special characters in text and attributes (e.g. `>`) must be escaped.

The following patterns are considered violations:

```html
<p>Hello & world</p>
```

```html
<p id="mine&ours" class="yours>mine">Hello world</p>
```

```html
<p id="john&*;paul&;ringo&george^">Hello world</p>
```

The following patterns are considered not violations:

```html
<p class="foo\&bar">Hello world</p>
```

```html
<p class="foo bar">Hello \& world</p>
```
