# table-req-caption

If set, each `table` must contain at least one `caption` tag.

The following patterns are considered violations:

```html
<table></table>
```

```html
<table>
  <span>Caption</span>
</table>
```

```html
<table>
  <td>
    <caption>Hello</caption>
  </td>
</table>
```

```html
<table></table>
<caption>Hello</caption>
```

The following patterns are not considered violations:

```html
<table>
  <thead><thead>
  <tbody></tbody>
  <caption>Hello</caption>
</table>
```

```html
<table>
  <caption>Hello</caption>
  <thead><thead>
  <tbody></tbody>
</table>
```

```html
<table>
  <caption>Hello</caption>
</table>
```
