# id-class-style

_This rule is deprecated and will be removed in LintHTML v1. Use the rules [id-style](../id-style/README.md) and [class-style](../class-style/README.md) instead._

A format specifier, or `false`. If set, `id`s and `class`es must fit the given format.
May be overridden by [class-style](../class-style/README.md) for classes and [id-style](../id-style/README.md) for ids.

Possible values :

* `"lowercase"`: Consists of lowercase letters
* `"underscore"`: Lowercase and underscore-separated
* `"dash"`: Lowercase and separated by hyphens
* `"camel"`: camelCase (or CamelCase)
* `"bem"`: The BEM (block, element, modifier) syntax
