# input-req-label

If set, each input elements must have an associated `label` element. The label may be a parent of the input element, or may identify the element it labels using its `for` attribute, which must match the input's `id` (or `name`, for text inputs) attribute.

The following patterns are considered violations:

```html
<div>
  <label>
    <div>
      <input type="text" value="great">
    </div>
  </label>
</div>
```

```html
<div>
  <label>
    <div>
      <input type="radio" value="great" >
    </div>
  </label>
</div>
```

```html
<input type="text" value="great" >
```

```html
<input type="radio" value="great" >
```

```html
<div>
  <label for="dinosaur">Label!</label>
</div>
<section>
  <input type="text" name="romeo">
</section>
```

```html
<div>
  <label for="dinosaur">Label!</label>
</div>
<section>
  <input type="text" id="romeo">
</section>
```

The following patterns are not considered violations:

```html
<div>
  <label for="dinosaur">Label!</label>
</div>
<section>
  <input type="text" name="dinosaur">
</section>
```

```html
<div>
  <label for="dinosaur">Label!</label>
</div>
<section>
  <input type="radio" id="dinosaur">
</section>
```
