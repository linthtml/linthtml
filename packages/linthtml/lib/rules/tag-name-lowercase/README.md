# tag-name-lowercase

If set, tag names must be lowercase.

_Only the opening tag is checked mismatches between open and close tags are checked by `tag-name-match`._

The following patterns are considered violations:

```html
<Button>A button</button>
```

The following patterns are not considered violations:

```html
<button>A button</button>
```
