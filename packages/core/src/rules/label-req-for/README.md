# label-req-for

If set, each `label` tab must have a `for` attribute. This practice helps screen readers, and improves form element selection by allowing the user to focus an input by clicking on the label.

The following patterns are considered violations:

```html
<label>
  <input type="text" id="thing"/>
</label>
```

```html
<label for="noexist">
  <input type="text" id="thing"/>
</label>"
```

```html
<label>
  <p>not labeable</p>
</label>
```

```html
<div>
  <label for="para"></label>
  <div id="para"></div>
</div>
```

The following patterns are not considered violations:

```html
<label for="thing">The Thing</label>
<input type="text" id="thing"/>
```

```html
<label for="thing">
  <input type="text" id="thing"/>
</label>
```

## References

* See [MDN: label element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)",
* See [MDN: How to structure an HTML form](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/How_to_structure_an_HTML_form)."
