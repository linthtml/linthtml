# Changelog

## v0.8.0

### Features 🚀

#### Provide Plugins

It's now possible to provide plugins to LintHTML using the property `plugins` in the config file.
This property accept a string or an array of strings. The string values can be the name of a package or the path to a file.
To learn more about Plugins read [the documentation page](./docs/plugins.md).

### Fix 🛠️

Value for settings `attr-name-ignore-regex` and `id-class-ignore-regex` are now correctly converted to regexp when coming from a json config file.

## v0.8.0-beta.2

### Fix 🛠️

Fix error in plugins docs.

## v0.8.0-beta.1

### Features 🚀

#### Provide Plugins

It's now possible to provide plugins to LintHTML using the property `plugins` in the config file.
This property accept a string value or an array of string, which could be the name of package or the path to a file.
To learn more about Plugins read [the documentation page](./docs/plugins.md).

## v0.7.2

### Fix 🛠️

- Rule `indent-width` now longer ignore nodes that are siblings with a text node ending with an EOL char

```html
<div>
  foo
   <span>bar</span>
  <!-- Now the previous node is correctly handle and this report an error -->
</div>
```

## v0.7.0

### Breaking change ⚠️

#### Parser now return root node

Because of the latest version of [htmlparser2](https://github.com/fb55/htmlparser2#readme), the HTML parser now return a single node instead of an array of nodes. The node returned by the parser is the `root` node of the HTML document parsed.

This internal change has also an impact on the new parser feature. Custom parsers will also have to return a `root` node to LintHTML and not an array of node.

### Features 🚀

#### Provide a custom parser

It's now possible to provide a custom parser to the linter using the property `parser` in the config file.
This property accept a string value, which could be the name of package or the path to a file. The file or package should expose a function that takes a string value in input (HTML to parse) and return an AST tree compatible with LintHTML.

You can have a look to [@linthtml/linthtml-pug](https://github.com/linthtml/linthtml-pug) to see an example of a custom parser.

### Refactor 🧰

#### Split rules

Move nested rules into their own folder. The code for rules like `indent-width`, `indent-style`... are no longer mixed in the files.

#### Remove `indent` property to node

Nodes no longer have the property `indent`. This property was used by the rules `indent-*` to know what type of indentation is present before a node.
But this property was not necessary, a node indentation can be found by looking at the previous node. If the previous node is a text node with only spaces/tabs chars then it's an indentation node and we can use it, otherwise, it means that the node has no indentation.

### Fix 🛠️

- Correctly define `--print-config` option with meow

## v0.7.0-beta.4

### Breaking change ⚠️

#### Parser now return root node

Because of the latest version of [htmlparser2](https://github.com/fb55/htmlparser2#readme) the HTML parser now return a single node instead of an array of nodes. The node returned by the parser is the `root` node of the HTML document parsed.

This internal change has also an impact on the new parser feature. Custom parsers will also have to return a `root` node to LintHTML.

### Refactor 🧰

#### Remove `indent` property to node

Nodes no longer have the property `indent`. This property was used by the rules `indent-*` to know what type of indentation is present before a node.
But this property was not necessary, a node indentation can be found by looking at the previous node. If the previous node is a text node with only spaces/tabs chars then it's an indentation node and we can use it, otherwise, it means that the node has no indentation.

## v0.7.0-beta.3

### Provide a custom parser

It's now possible to provide a custom parser to the linter using the property `parser` in the config file.
This property accept a string value, which could be the name of package or the path to a file. The file or package should expose a function that takes a string value in input (HTML to parse) and return an AST tree compatible with LintHTML.

You can have a look to [@linthtml/linthtml-pug](https://github.com/linthtml/linthtml-pug) to see an example of a custom parser.

## v0.7.0-beta.2

### Fix 🛠️

- Correctly define `--print-config` option with meow

## v0.7.0-beta.1

### Refactor 🧰

Move nested rules into their own folder. The code for rules like `indent-width`, `indent-style`... are no longer mixed in the files.

## v0.6.3

### Fix 🛠️

- Rule `indent-width` no longer report an error for such HTML

```html
<script
  src="http://link.com"
></script>
```

## v0.6.2

### Fix 🛠️

- Correctly define `--print-config` option with meow

## v0.6.1

### Fix 🛠️

- Rule `input-req-label` no longer report an error for input with type "hidden".
- Rule `input-req-label` no longer report an error for input with type "button" when the attribut value has a non empty value.

## v0.6.0

### Features 🚀

### Shareable configuration

It's now possible to use and extends [shareable configurations](./docs/shareable-configs.md) in LintHTML.
Shareable configuration can be extended in a `.linthtmlrc*` file using the keyword `extends`.

```json
{
    "extends": "my-linthtml-config",
    "rules": {
      // ...
    }
}
```

⚠ Shareable configuration can only be used with the [new config format](./docs/migrations.md#030-upgrade-guide).

To learn more about shareable configuration and how to use them you can read the [documentation](./docs/configuration.md#extending-configuration-files).

#### New Inline instructions

It's now possible to enable/disable rules by using `linthml-disable` and `linthtml-enable` in a document.
There's a complete documentation about this new inline instruction in the [README](./README.md#disableenable-instructions).

### Improvements 💅

Some rules error messages have been improved to give more explanations about the problem.

### Refactor 🧰

#### Remove [yaml package](https://www.npmjs.com/package/yaml

LintHTML now use [js-yaml](https://www.npmjs.com/package/js-yaml) insteal of [yaml](https://www.npmjs.com/package/yaml) to generate the content of the configuration file (yaml format ^^). The package [js-yaml](https://www.npmjs.com/package/js-yaml) was already available thanks to [cosmiconfig](https://www.npmjs.com/package/cosmiconfig) so it was unnecessary to add a other package to deal with yaml.

#### Run indent-x rules on every node

Previously, the rules `indent-style`, `indent-width`(...) were only run on the root tag of the HTML document linted. The other tags were accessed and checked by accessing the list of children nodes of the root tag (and the children nodes of the children...). This used to works, indent issues were reported correctly but by doing this, it was not possible to deactivate the rules for a specific part of the document using an inline config.

Now, the rules is executed per node which make it possible to enable/disable the rules for a part of the DOM using an inline config.

### Fix 🛠️

- Doctype position is now correctly extracted and no longer messes with inline configurations when there's an inline config before the doctype.
- Rules `class-style`, `id-style`, `id-class-no-ad`, `id-no-dup`, and `id-class-style` no longer crash when there's no value for `id` and `class` attributes.

## v0.6.0-beta.3

### Features 🚀

#### New Inline instructions

It's now possible to enable/disable rules by using `linthml-disable` and `linthtml-enable` in a document.
There's a complete documentation about this new inline instruction in the [README](./README.md#disableenable-instructions).

### Improvements 💅

Some rules error messages have been improved to give more explanations about the problem.

### Fix 🛠️

- Doctype position is now correctly extracted and no longer messes with inline configurations when there's an inline config before the doctype.
- Rules `class-style`, `id-style`, `id-class-no-ad`, `id-no-dup`, and `id-class-style` no longer crash when there's no value for `id` and `class` attributes.

## v0.6.0-beta.2

### Refactor 🧰

#### Remove [yaml package](https://www.npmjs.com/package/yaml

LintHTML now use [js-yaml](https://www.npmjs.com/package/js-yaml) insteal of [yaml](https://www.npmjs.com/package/yaml) to generate the content of the configuration file (yaml format ^^). The package [js-yaml](https://www.npmjs.com/package/js-yaml) was already available thanks to [cosmiconfig](https://www.npmjs.com/package/cosmiconfig) so it was unnecessary to add a other package to deal with yaml.

#### Run indent-x rules on every node

Previously, the rules `indent-style`, `indent-width`(...) were only run on the root tag of the HTML document linted. The other tags were accessed and checked by accessing the list of children nodes of the root tag (and the children nodes of the children...). This used to works, indent issues were reported correctly but by doing this, it was not possible to deactivate the rules for a specific part of the document using an inline config.

Now, the rules is executed per node which make it possible to enable/disable the rules for a part of the DOM using an inline config.

## v0.6.0-beta.1

### Features 🚀

### Shareable configuration

It's now possible to use and extends [shareable configurations](./docs/shareable-configs.md) in LintHTML.
Shareable configuration can be extended in a `.linthtmlrc*` file using the keyword `extends`.

```json
{
    "extends": "my-linthtml-config",
    "rules": {
      // ...
    }
}
```

⚠ Shareable configuration can only be used with the [new config format](./docs/migrations.md#030-upgrade-guide).

To learn more about shareable configuration and how to use them you can read the [documentation](./docs/configuration.md#extending-configuration-files).

## v0.5.2

### Fix 🛠️

- rule `attr-new-line`, don't report errors when there's one attribute per line and rule config is `0` or `+0` (match the rule documentation)

## v0.5.1

### Fix 🛠️

- Generate JSON config file with correct json object inside.
- Use `Object.defineProperty` to add `attributes` property to AST node and fix a runtime error.

## v0.5.0

### Features 🚀

#### New rule

Add the rule `no-surrounding-whitespace` disallowing the presence of encapsulating whitespace.
For example the following code will report an error:

```html
<p>  A simple text with whitespaces before</p>
```

You can find more informations in the [rule doc](./lib/rules/no-surrounding-whitespace/README.md).

#### Improve config file search

Now, for each file linted, LintHTML will look for a config file in the file local folder.
If a config file is found, LintHTML will use it. If there's no config file LintHTML will check each parent folder and stop once it finds a config file or reaches the `HOME` folder.

### Print error for invalid rule config

LintHTML will now report an error if a rule is not correctly activated in the new config format.
For example, the following patterns will now print errors in the console.

```
// Valid string values are "error", "warning" and "off"
"rule-name": "foo" 

// Only string, boolean and array are accepted
"rule-name": 1 
"rule-name": {}

// If an array is provided, the first value should be a valid string or a boolean
"rule-name": [1, rule_config] 
"rule-name": ["foo", rule_config]
"rule-name": [{}]

```

### Breaking change ⚠️ (old config)

Remove the possibility to use [presets in inline config](https://github.com/htmllint/htmllint/wiki/Inline-Configurations#presets). This feature was not documented in LintHTML and not available when using the new config format.

### Improvements 🔧

#### HTML parser improvments

Upgrade [htmlparser2](https://github.com/fb55/htmlparser2) and improve outputed AST to extract more informations about nodes, for example now a node element:

- contains all attributes event the duclicated and know the start and end location for each.
- has more informations about open/close tags

All nodes now include a property `loc` containing start and end position (line/column).

Thanks to the AST improvements somme rules have been updated to better target the errors locations.

### Refactor 🧰

#### Config validations utils function

Create some utils functions to check rules config and have unified error messages.

## v0.5.0-beta.4

### Features 🚀

Added new rule `no-surrounding-whitespace` disallowing the presence of encapsulating whitespace, [see rule doc](./lib/rules/no-surrounding-whitespace/README.md).

## v0.5.0-beta.3

### Features 🚀

### Improve config file search

Now, for each file linted, LintHTML will look for a config file in the file local folder. If there's a config file LintHTML will use it, if there's no config file LintHTML will check each parent and stop once it find a config file or reach the `HOME` folder.

### Refactor 🧰

### Config validations utils function

Create some utils functions to check rules config and have unified error messages.

## v0.5.0-beta.2

### Improvements 🔧

Improve issues locations for a bunch rules.

### Internal

Get rig of the peudo rules line to only use the AST tree in all rules.

## v0.5.0-beta.1

### Features 🚀

Upgrade [htmlparser2](https://github.com/fb55/htmlparser2) and improve outputed AST.
Now a node element:

- contains duplicated attributes and has the start and end location for each.
- has more informations about open/close tags

All nodes now include a property `loc` containing start and end position (line/column).

### v0.4.2

## Features 🚀

Rule [`lang`](./lib/rules/lang/README.md) now support simplified Chinese and traditional Chinese.

Use the following codes in your `linthtmlrc` file.
- `zh-cmn-Hans`: simplified Chinese
- `zh-cmn-Hant`: traditional Chinese

## v0.4.1

## Fix 🛠️

Correct classes extractions to avoid reporting `class-style` errors for empty class.

## v0.4.0

### Features 🚀

#### [CLI] Improved `init` command

Give the possiblity to select the output format between `JS`, `JSON` and `YAML`. It's also possible to generate a config file in the legacy format (like HTMLLint) or in the new format (introduced in the [v0.3.0](#v0.3.0)).

#### Inline config with new config

Inline configs are now working with the new config format introduced in the [v0.3.0](#v0.3.0).
Inline config can be used to change a rule config or enable/disable a rule, see the [documentation](./README.md#inline-configuration) for more informations about inline config usages.

#### Ignore files

It's now possible to specify a list of list files to ignore using `.linthtmlignore` file or `ignoreFiles` property in the config file ([Documentation page](./docs/ignore-code.md)).

### Improvements 🔧

- Change `focusable-tabindex-style` rule behavior, now this rules report errors if a node has a tabindex greater than 0.
`frame` tag are now listed as self closing elements.
- Improve error message for rules `indent-size` and `indent-style`.

### Fix 🛠️

- The rule `id-class-style` is now correctly called when `id-style` or `class-style` are not activated.
- `tag-bans` is now case insensitive, when config is only a single string (same behavior as array config)
- Correctly extract config that are just numbers.

## v0.4.0-beta.4

### Feature 🚀

Inline config now work with the new config format.

## v0.4.0-beta.3

### Improvement 🔧

Change `focusable-tabindex-style` rule behavior, now this rules report errors if a node has a tabindex greater than 0.
`frame` tag are now listed as self closing elements.

### Fix

- The rule `id-class-style` is now correctly called when `id-style` or `class-style` are not activated.n
- `tag-bans` is now case insensitive, when config is only a single string (same behavior as array config)
- Correctly extract config that are just numbers.

### Refactor 🧰

Remove the speudo rule "tag" and use "dom" instead.
Test all the rules with the new linter and the new config.

## v0.4.0-beta.2

### Feature 🚀

List files to ignore using `.linthtmlignore` file or `ignoreFiles` property in config object. ([Documentation page](./docs/ignore-code.md))

### Improvement 🔧

Improve error message for rules `indent-size` and `indent-style`

## v0.4.0-beta.1

### Feature 🚀

#### [CLI] Improve the `init` command

Give the possiblitie to selet the output format between `JS`, `JSON` and `YAML` and to generate a config file in the 
legacy format (like HTMLLint) or in the new format (introduced in the [v0.3.0](#v0.3.0))

## v0.3.2

### Fix

- [#142] `link-min-length-4` - Search for text content in child nodes
- [#140] `button-req-content` - Ignore html comments when searching for button's textcontent.

## v0.3.1

### Fix

`id-class-style` rule now report errors even rules `id-style` and `class-style` are disabled

## v0.3.0

### Feature 🚀

#### New config file format

You can more details about this new format in the [migration docs](./docs/migrations.md#030-upgrade-guide).

#### Warning level

You can now set a rule as warnig in the config file (⚠️ only available with the [new config format](#new-config-file-format)).

#### New rules

Add new rules from htmllint v0.8.0

- [link-min-length-4](./lib/rules/link-min-length-4)
- [input-btn-req-value-or-title](./lib/rules/input-btn-req-value-or-title)
- [button-req-content](./lib/rules/button-req-content)
- [label-no-enc-textarea-or-select](./lib/rules/label-no-enc-textarea-or-select)
- [fieldset-contains-legend](./lib/rules/fieldset-contains-legend)

#### Beta version warning

The CLI will now output a small warning message when running a beta version.

### Improvement 🔧

#### Better issues output

The CLI's output for the issues as been improved and now everythings is properly aligned to improve the readability.

## v0.3.0-beta.3

### CLI

- [IMPROVMENT] Improve issues display in terminal

### chore

- [FEATURE] Add missing HTMLLint's rules (added in v0.8.0)

## v0.3.0-beta.2

- [FEATURE] Add warning level for rules/issues.

## v0.3.0-beta.1

- [FEATURE] New config format (more details [here](./docs/migrations.md#030-upgrade-guide))
- [FEATURE][CLI] Warning message when running beta version

- [REFACTOR] Get rid of some meta rules.

## v0.2.7

- [SECURITY] Remove bulkify dependencie

## v0.2.6

- [FIX] #68, #69, #70 and #71

## v0.2.5

- [FIX] #61 Exit shell process with an error code when there's lint errors
- [FIX] #64 Change `raw-ignore-text` behaviour to stop reporting unexisting lint errors

## v0.2.4

- [FIX] #58 `indent-width` stop reporting error for this html

```html
<p>
  foo
  <span>bar</span>
</p>
```

## v0.2.3

- [FIX] Correct an issue with rules errors messages generation

## v0.2.2

- [FIX] `indent-width` stop reporting error for this html

```html
<p>
  foo<span>bar</span>
</p>
```

- [FIX] `attr-no-unsafe-char` Allow new line, spaces, tabs... in attributes

_close #55_

- [REFACTOR] Get rid of lodash

## v0.2.1

- [FIX] Add missing `await` preventing the display of lint errors

## v0.2.0

- [REMOVED] Support for node@6
- [REMOVED] Removed rule `spec-char-escape`. You cannot escape characters with `\` in HTML text.
- [REMOVED] Stop reporting issues for invalid rule config
- [REMOVED] Stop reporting issues for nonexisting rule

- [IMPROVEMENT] Throw an error for nonexisting rule and stop the cli.
- [IMPROVEMENT] Throw an error for invalid rules config and stop the cli.
- [IMPROVEMENT] Now `indent-style` and `indent-width` catch more errors than before. Checkout [rules](./lib/rules/indent-style/README.md) doc for more information about valid/invalid patterns.
- [IMPROVEMENT] Rule `tag-req-attr`, report an error per missing attributs and list missing attributes in error messages.
- [IMPROVEMENT] Rule `title-no-dup`, report an error per duplicated `<title>` tag.

- [REFACTOR] Move rules's tests inside rule folder
- [REFACTOR] Remove `strict` option for rule `label-req-for` due to the lack of documentations and tests.

- [FIX] Make `+0` option for rule `attr-new-line` behave has explained in the rule's description
- [FIX] Correct `input-req-label` rule and now report errors even when `for` value match inputs's `name` attribute. (`for` should be paired with `id` as specified in [HTML specs](https://www.w3.org/TR/html52/sec-forms.html#element-attrdef-label-for))

## v0.1.8

- [FIX] Correct tarball generation

## v0.1.7

- [BUILD] Security upgrade for dependencies

## v0.1.3

- [FIX] #14 correct doc replace `.htmllintrc` with `.linthtmlrc`
- [FIX] #13 Fix import of `checkInvalidCliOptions`

## v0.1.2

- [FIX] Display an error when the CLI is called with the `--config` option and no path

## v0.1.1

- [FIX] Move "cosmiconfig" from devDependencies to dependencies

## v0.1.0 [First release]

- Integrated command line tool
- 55 [Rules](./docs/rules)
