# attr-no-unsafe-char

If set, unsafe characters may not be used in attribute values. The unsafe characters are those whose unicode values lie in the ranges 0000-0009, 000b-000c, 000e-001f, 007f-009f, 00ad, 0600-0604, 070f, 17b4, 17b5, 200c-200f, 2028-202f, 2060-206f, feff, fff0-ffff.

The following patterns are considered violations:

```html
  <button class="\u2013"></button>
```

The following patterns are not considered violations:

```html
  <button class="foo"></button>
```
