# attr-no-dup

If set, no more than this number of attributes may be on the same row.
A value of 0 applies only to the first row, restricting subsequent rows to one element, and a value of "+0" is the same but allows an attribute to be on the first row if there is only one attribute.

# Options

A non-negative integer, or "+0".

Given:

```
  "attr-new-line": "1"
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
