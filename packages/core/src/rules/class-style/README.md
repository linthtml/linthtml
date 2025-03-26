# class-style

Specify a format for the classnames inside the `class` attribute, when set, all classnames must fit the format.

Given:

```json
  {
    "class-style": ["error", "underscore"]
  }
```

The following patterns are considered violations:

```html
  <button class="buttonBlue"></button>
```

```html
  <button class="button--blue"></button>
```

The following patterns are not considered violations:

```html
  <button class="button_blue"></button>
```

## Options

The rule accept the following as rule options.

* A validation regexp **_deprecated_**

```js
module.exports = {
  rules: {
    "class-style": [true, /^[0-9a-o]+$/],
  },
};
```

* A string value form the following list value [`lowercase`, `underscore`, `dash`, `camel`, `bem`, `none`] **_deprecated_**

```json
{
  "rules": {
    "class-style": [true, "dash"]
  }
}
```

* An config object

```ts
"class-style": [true, {
  format: "lowercase" | "underscore" | "dash" | "camel" | "bem" | "none" | RegExp;
  ignore?: string | RegExp
}],
```

### format

Format used to validate classnames, possible values are :

* `"lowercase"`: Consists of lowercase letters
* `"underscore"`: Lowercase and underscore-separated
* `"dash"`: Lowercase and separated by hyphens
* `"camel"`: camelCase (or CamelCase)
* `"bem"`: The BEM (block, element, modifier) syntax
* `"none"`: Does not enforce a format and prevent the rule from using the format specified by the rule [id-class-style](../id-class-style/README.md).
* A regexp: A regexp can also be provided for custom class style validation

### ignore

String or regexp used to ignore some classnames.

```js
module.exports = {
  rules: {
    "class-style": [
      "error", 
      {
        ignore: /^class-\w+/
      }
    ]
  },
};
```

The following patterns are considered violations:

```html
  <div class="foo"></div>
```

The following patterns are not considered violations:

```html
  <div id="class-foo"></div>
```
