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

# text-ignore-regex

A string giving a regular expression, a RegExp object, or `false`. If set, text matching the given regular expression is ignored by rules which apply to raw text (currently, just `spec-char-escape`). For example, `\\[{.*?}\\]` will exclude text wrapped in `[{...}]`. Note that such text may still cause the input html to parse incorrectly, which could result in errors in other rules later. To remove such text before parsing, use `raw-ignore-regex`.
