
# indent-width

Enforce consistent indentation style size.
The value of this option is either `false` or a positive integer. If it is a number and `spaces` are used for indentation, then `spaces` used to indent must come in multiples of that number.

Given:

```
  "indent-width": ["error", 2]
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
