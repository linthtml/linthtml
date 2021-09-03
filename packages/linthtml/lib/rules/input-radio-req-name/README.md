# input-radio-req-name

If set, each radio-type input must have a nonempty name attribute.

The following patterns are considered violations:

```html
<input type="radio">
````

```html
<input type="radio" name>
```

```html
<input type="radio" name="">
```

The following patterns are not considered violations:

```html
<input type="radio" name="hello">
```
