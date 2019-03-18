# id-style

Specify a format for the value inside the `id` attribute, when all set all ids must fit the format

## Options

Possible values :

* `"lowercase"`: Consists of lowercase letters
* `"underscore"`: Lowercase and underscore-separated
* `"dash"`: Lowercase and separated by hyphens
* `"camel"`: camelCase (or CamelCase)
* `"bem"`: The BEM (block, element, modifier) syntax

Given:

```
  "id-style": "underscore"
```

The following patterns are considered violations:

```html
  <button id="buttonBlue"></button>
```

```html
  <button id="button--blue"></button>
```

The following patterns are not considerd violations:

```html
  <button id="button_blue"></button>
```

# id-class-style

A format specifier, or `false`. If set, `id`s and `class`es must fit the given format. May be overridden by `class-style` for `class`es.

Possible values :

* `"lowercase"`: Consists of lowercase letters
* `"underscore"`: Lowercase and underscore-separated
* `"dash"`: Lowercase and separated by hyphens
* `"camel"`: camelCase (or CamelCase)
* `"bem"`: The BEM (block, element, modifier) syntax

# id-class-ignore-regex

The value is either a string giving a regular expression or `false`. If set, `id`s and `class`es matching the given regular expression are ignored for the `id-class-style` rule. For example, excluding `{{...}}` classes used by Angular and other templating methods can be done with the regex.
