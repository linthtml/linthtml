# label-no-enc-textarea-or-select

A rule from WCAG http://oaa-accessibility.org/wcag20/rule/74/.
The label element should not encapsulate select and textarea elements.

The following patterns are considered violations:

```html
  <label>
    <select>
      <option value="v1">V1</option>
      <option value="v2">V2</option>
      <option value="v3">V3</option>
    </select>
  </label>
```

```html
  <label>
    <textarea></textarea>
  </label>
```

```html
  <label>
    <div>
      <div>
        <select>
          <option value="v1">V1</option>
          <option value="v2">V2</option>
          <option value="v3">V3</option>
        </select>
      </div>
    </div>
  </label>
```

The following patterns are not considered violations:

```html
  <label for="select">Foo</label>
  <select id="select">
    <option value="bar">Bar</option>
  </select>
```

```html
  <label for="textarea">Fizz</label>
  <textarea id="textarea"></textarea>
```
