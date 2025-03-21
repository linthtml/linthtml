# attr-name-style

If set, HTML attributes names must conform to the given format.

## Options

The rule accept the following as rule options.

* A validation regexp:

```js
module.exports = {
  rules: {
    "attr-name-style": [true, /^[0-9a-o]+$/],
  },
};
```

* A string value form the following list value [`camel`,`regexp`,`lowercase`,`dash`] 

```json
{
  "rules": {
    "attr-name-style": [true, "dash"],
  },
};
```

* An config object

```ts
"attr-name-style": [true, {
  // Format to use to validate attribute name
  format: "camel" | "regexp" | "lowercase" | "dash" | RegExp;
  // String or regexp use to ignore attribute names
  ignore?: string | RegExp
}],
```

### format

Given the following config:

```js
module.exports = {
  rules: {
    "attr-name-style": [
      "error", 
      {
        format: 'dash',
      }
    ]
  },
};
```

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

### ignore

```js
module.exports = {
  rules: {
    "attr-name-style": [
      "error", 
      {
        format: 'dash',
        ignore: 'xLink'
      }
    ]
  },
};
```

The following patterns are considered violations:

```html
  <div attrName=""></div>
```

The following patterns are not considered violations:

```html
  <div xLink=""></div>
```
