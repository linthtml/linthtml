# attr-quote-style

Enforce the consistent use of quotes accross code.

## Options

Possible values :

* `"double"`: Attribute values must be quoted using double quotes.
* `"single"`: Attribute values must be quoted using single quotes.
* `"quoted"`: Attribute values must be quoted.

Given:

```
  "attr-quote-style": "double"
```

The following patterns are considered violations:

```html
  <button id='foo' class='bar'></button>
```

The following patterns are not considered violations:

```html
  <button class="foo" id="bar"></button>
```
