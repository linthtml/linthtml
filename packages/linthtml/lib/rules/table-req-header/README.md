# table-req-header

If set, each `table` tag must contain a header: a `thead` tag or a `tr` tag with a `th` child.

The following patterns are considered violations:

```html
<table></table>
```

```html
<table>
  <tr>
    <td>
    </td>
  </tr>
</table>
```

```html
<table>
  <tbody>
  </tbody>
</table>
```

The following patterns are not considered violations:

```html
<table>
  <thead>
  </thead>
</table>
```

```html
<table>
  <tr>
    <th>
    </th>
  </tr>
</table>
```
