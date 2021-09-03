# attr-name-style

If set, HTML attributes names must conform to the given format.

## Options

Possible values :

* `camel`
* `regexp`
* `lowercase`
* `dash` [default]

Given:

`"dash"`

The following patterns are considered violations:

```html
  <div attrName=""></div>
```

```html
  <div attr_name=""></div>
```

The following patterns are not considered violations:

```html
  <div attr-name=""></div>
```
