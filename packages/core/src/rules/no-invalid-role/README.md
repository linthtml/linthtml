# no-invalid-role

If set, disallow the use of invalid html [role](https://www.w3.org/TR/wai-aria/#roles_categorization) on elements.

This rule will check for the following:

* Use of the presentation role for content which should convey semantic information may prevent the user from understanding that content. This rule checks semantic HTML elements for the presence of `role="none"` or `role="presentation"` and compares it to the list of disallowed elements.

* Use of invalid role for elements which does not fall under any of the values in this [list](https://www.w3.org/TR/wai-aria/#roles_categorization).

Given:

```json
  {
    "no-invalid-role": "error"
  }
```

The following patterns are considered violations:

```html
<table role="presentation">
</table>
```

```html
<button role="presentation">
</button>
```

```html
<ul role="none">
</ul>
```

```html
<div role="accordion"></div>
```

```html
<div role="custom role"></div>
```

The following patterns are not considered violations:

```html
<img role="presentation" alt="">
```

```html
<span role="none"></span>
```

## Options

This rule accept the following option object

```ts
  "no-invalid-role": [
    true,
    {
      reportNoneExisting: boolean
    }
  ],
```

### reportNoneExisting

Whether none existing role values should be reported (defaults to true)

Given:

```json
  {
    "no-invalid-role": [
      "error",
      {
        "reportNoneExisting": false
      }
    ]
  }
```

The following pattern are not considered violations

```html
<div role="accordion"></div>
```

```html
<div role="custom role"></div>
```
