# tag-bans

The value of this option is a list of strings, each of which is a tag name. Tags with any of the given names are disallowed.

Given :

```
  "tag-bans": ["div", "center"],
```

The following patterns are considered violations:

```html
<div>Hello & world</div>
```

```html
<center>Hello & world</center>
```

The following patterns are considered not violations:

```html
<p>Hello & world</p>
```
