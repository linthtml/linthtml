# id-style

Specify a format for the value inside the `id` attribute, when all set all ids must fit the format

Given:

```json
  {
    "rules": {
      "id-style": ["error", "underscore"]
    }
  }
```

The following patterns are considered violations:

```html
  <button id="buttonBlue"></button>
```

```html
  <button id="button--blue"></button>
```

The following patterns are not considered violations:

```html
  <button id="button_blue"></button>
```

## Options

The rule accept the following as rule options.

* A validation regexp **_deprecated_**

```js
module.exports = {
  rules: {
    "id-style": [true, /^[0-9a-o]+$/],
  },
};
```

* A string value form the following list value [`lowercase`, `underscore`, `dash`, `camel`, `bem`, `none`] **_deprecated_**

```json
{
  "rules": {
    "id-style": [true, "dash"]
  }
}
```

* An config object

```ts
"id-style": [true, {
  format: "lowercase" | "underscore" | "dash" | "camel" | "bem" | "none" | RegExp;
  ignore?: string | RegExp
}],
```

### format

Format used to validate ids, possible values are :

* `"lowercase"`: Consists of lowercase letters
* `"underscore"`: Lowercase and underscore-separated
* `"dash"`: Lowercase and separated by hyphens
* `"camel"`: camelCase (or CamelCase)
* `"bem"`: The BEM (block, element, modifier) syntax
* `"none"`: Does not enforce a format and prevent the rule from using the format specified by the rule [id-class-style](../id-class-style/README.md).
* A regexp: A regexp can also be provided for custom id style validation

### ignore

String or regexp used to ignore some classnames.

```js
module.exports = {
  rules: {
    "id-style": [
      "error", 
      {
        ignore: /^id-\w+/
      }
    ]
  },
};
```

The following patterns are considered violations:

```html
  <div id="foo"></div>
```

The following patterns are not considered violations:

```html
  <div id="id-foo"></div>
```
