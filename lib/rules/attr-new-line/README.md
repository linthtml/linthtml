# attr-new-line

If set, no more than this number of attributes may be on the same row.
A value of `0` applies only to the first row, restricting subsequent rows to one element. A value of `+0` is the same but allows one attribute to be on the first row.

## Options

A non-negative integer, or "+0".

Given:

```json
{
  "attr-new-line": [true, "1"]
}
```

The following patterns are considered violations:

```html
  <button class="foo" id="bar"></button>
```

The following patterns are not considered violations:

```html
  <button class="foo"
          id="bar"></button>
```

Given:

```json
{
  "attr-new-line": [true, "0"]
}
```

The following patterns are considered violations:

```html
  <button class="foo"></button>
```

The following patterns are not considered violations:

```html
  <button
    id="bar">
  </button>
```

Given:

```json
{
  "attr-new-line": [true, "+0"]
}
```

The following patterns are considered violations:

```html
  <button class="foo" id="bar"></button>
```

The following patterns are not considered violations:

```html
  <button class="foo"
    id="bar">
  </button>
```
