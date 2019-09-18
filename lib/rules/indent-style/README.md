# indent-style

Enforce consistent indentation style.

## Options

Possible values :

* `"tabs"`: Only tabs may be used for indentation.
* `"spaces"`: Only spaces may be used for indentation.
* `"nonmixed"`: Either tabs or spaces may be used, but not both in the same file.
* `false`: No restriction

Given:

```
  "indent-style": "spaces"
```

The following patterns are considered violations:

```html
/*tab*/<button id="buttonBlue"></button>
```

The following patterns are not considered violations:

```html
/*space*//*space*/<button id="buttonBlue"></button>
```

# indent-width

Enforce consistent indentation style size.
The value of this option is either `false` or a positive integer. If it is a number and `spaces` are used for indentation, then `spaces` used to indent must come in multiples of that number.

Given:

```
  "indent-width": 2
```

The following patterns are considered violations:

```html
/*space*/<button id="buttonBlue"></button>
```

```html
<div><p>foo</p>
</div>
```

```html
<div>
 </div>
```

```html
<div><p>foo</p>
  <p>foo</p>
</div>
```

The following patterns are not considered violations:

```html
/*space*//*space*/<button id="buttonBlue"></button>
```

```html
<div><p>foo</p></div>
```

```html
<div>
</div>
```

```html
<div>
  <p>foo</p>
</div>
```

```html
<div>
  <p>foo</p><p>foo</p>
  <p>foo</p>
</div>
```
