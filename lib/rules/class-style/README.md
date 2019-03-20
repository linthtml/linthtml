# class-style

Specify a format for the classnames inside the `class` attribute, when set all classnames must fit the format

## Options

Possible values :

* `"lowercase"`: Consists of lowercase letters
* `"underscore"`: Lowercase and underscore-separated
* `"dash"`: Lowercase and separated by hyphens
* `"camel"`: camelCase (or CamelCase)
* `"bem"`: The BEM (block, element, modifier) syntax

Given:

```
  "class-style": "underscore"
```

The following patterns are considered violations:

```html
  <button class="buttonBlue"></button>
```

```html
  <button class="button--blue"></button>
```

The following patterns are not considerd violations:

```html
  <button class="button_blue"></button>
```
