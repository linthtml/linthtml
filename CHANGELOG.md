# Changelog

## [0.11.0-beta.2](https://github.com/linthtml/linthtml/compare/v0.11.0-beta.1...v0.11.0-beta.2) (2025-03-27)

### Features 🚀

* [@linthtml/core] Deprecated following rules `attr-name-ignore-regex`,`id-class-ignore-regex`, `line-max-len-ignore-regex`, `spec-char-escape`, and `text-ignore-regex`.

_ℹ️ Deprecation messages will only be shown when using legacy config format. In the new config format these are not rules but settings and they are also deprecated._

* [@linthtml/core] Update rule `attr-name-style` to allow the following object config

  ```ts
  "attr-name-style": ["error", {
    format: "camel" | "regexp" | "lowercase" | "dash" | RegExp;
    ignore?: string | RegExp // A string or regexp pattern use to ignore some attributes
  }],
  ```

* [@linthtml/core] Update rule `class-no-dup` to allow the following object config

  ```ts
  "class-no-dup": ["error", {
    ignore?: string | RegExp // A string or regexp pattern use to ignore some classnames
  }],
  ```

* [@linthtml/core] Update rule `class-style` to allow the following object config

  ```ts
  "class-style": [true, {
    format: "lowercase" | "underscore" | "dash" | "camel" | "bem" | "none" | RegExp;
    ignore?: string | RegExp // A string or regexp pattern use to ignore some classnames
  }],
  ```

* [@linthtml/core] Update rule `id-style` to allow the following object config

  ```ts
  "id-style": [true, {
    format: "lowercase" | "underscore" | "dash" | "camel" | "bem" | "none" | RegExp;
    ignore?: string | RegExp // A string or regexp pattern use to ignore some ids
  }],
  ```

## [0.11.0-beta.1](https://github.com/linthtml/linthtml/compare/v0.10.2...v0.11.0-beta.1) (2025-03-20)

### Features 🚀

* [@linthtml/html-parser] Update htmlparser2 to latest version
* [@linthtml/linthtml] Deprecate fallback to htmllint presets when no config file is found. A warning message will now be displayed in the report with instruction on how to remove the warning.
* [@linthtml/linthtml] Add a new CLI option `--disable-preset-fallback` that will disable the htmllint preset fallback when no config file is found

### Bug fixes

* [@linthtml/core] Fix error message for `fig-req-figcaption` when `figcaption` has no parent tag `figure`
* [@linthtml/core] Fix broken documentation links in rule description pages

## [0.10.2](https://github.com/linthtml/linthtml/compare/v0.10.1...v0.10.2) (2025-04-02)

### Bug fixes

* [@linthtml/core] Correct error message for `no-inline-style` rule

## [0.10.1](https://github.com/linthtml/linthtml/compare/v0.10.0...v0.10.1) (2024-07-31)

### Bug fixes

* [@linthtml/core] Correctly load internal rules on windows

## [0.10.0](https://github.com/linthtml/linthtml/compare/v0.9.6...v0.10.0) (2024-07-29)

### Breaking 💥

* Drop support for node 14 and node 16.
* Rename packages to fix circular reference when building the packages, [@linthtml/linthtml] is now [@linthtml/core] and [@linthtml/cli] is now [@linthtml/linthtml].

### Features 🚀

* Add two new rules `no-inline-style` and `link-label-min-length`.
* Deprecated rules `id-class-style`, `id-class-no-ad`, `ìndent-delta`, `indent-width-cont` and `link-min-length-4`.
* Packages have been converted to esm.
* [@linthtml/dom-utils] Generate ESM and CJS files in build and add new atomic exports.
* [@linthtml/linthtml] Add CJS, ESM and TS output format for init command with types or JSDoc comments.

### Refactor 🧰

* Use nx instead of lerna as task runner

### Bug fixes

* [@linthtml/core] Correctly extract ignore patterns from .linthtmlignore file

## [0.10.0-beta.10](https://github.com/linthtml/linthtml/compare/v0.10.0-beta.9...v0.10.0-beta.10) (2024-07-02)

* [@linthtml/core] Add two new rules `no-inline-style` and `link-label-min-length`.
* [@linthtml/core] Deprecated rules `id-class-style`, `id-class-no-ad`, `ìndent-delta`, `indent-width-cont` and `link-min-length-4`

## [0.10.0-beta.9](https://github.com/linthtml/linthtml/compare/v0.10.0-beta.8...v0.10.0-beta.9) (2024-06-06)

### Features 🚀

* [@linthtml/cli] With package.json import not working in nodejs 22

## [0.10.0-beta.8](https://github.com/linthtml/linthtml/compare/v0.10.0-beta.7...v0.10.0-beta.8) (2024-05-30)

### Features 🚀

* [@linthtml/core] Improve custom error message for ESM-CJS require error

### Bug fixes

* [@linthtml/dom-utils] Fix file require in CJS build

## [0.10.0-beta.7](https://github.com/linthtml/linthtml/compare/v0.10.0-beta.6...v0.10.0-beta.7) (2024-05-29)

### Features 🚀

* [@linthtml/dom-utils] Generate ESM and CJS files in build and add new atomic exports.

### Bug fixes

* [@linthtml/core] Fix import of ESM plugins

## [0.10.0-beta.6](https://github.com/linthtml/linthtml/compare/v0.10.0-beta.5...v0.10.0-beta.6) (2024-03-24)

### Features 🚀

* [@linthtml/core] Add custom error message for ESM-CJS require error

### Bug fixes

* [@linthtml/core] Correctly extract ignore patterns from .linthtmlignore file

## [0.10.0-beta.5](https://github.com/linthtml/linthtml/compare/v0.10.0-beta.4...v0.10.0-beta.5) (2024-03-06)

### Features 🚀

* [@linthtml/linthtml] Update config init output to include JSDOC or TS types

## [0.10.0-beta.4](https://github.com/linthtml/linthtml/compare/v0.10.0-beta.3...v0.10.0-beta.4) (2024-03-05)

### Bug fixes

* [@linthtml/linthtml] Don't use default export for CLI

## [0.10.0-beta.3](https://github.com/linthtml/linthtml/compare/v0.10.0-beta.2...v0.10.0-beta.3) (2024-03-05)

### Features 🚀

* [@linthtml/linthtml] Add CJS, ESM and TS output format for init command

## [0.10.0-beta.2](https://github.com/linthtml/linthtml/compare/v0.10.0-beta.1...v0.10.0-beta.2) (2024-03-03)

### Bug fixes

* [@linthtml/linthtml] Add missing deps `@linthtml/core`

## [0.10.0-beta.1](https://github.com/linthtml/linthtml/compare/v0.9.5...v0.10.0-beta.1) (2024-03-03)

* Packages have been converted to esm
* Started migration to nx for handling building, testing and linting tasks.
* Packages have been renamed to fix a circular reference when building the packages, [@linthtml/linthtml] is now [@linthtml/core] and [@linthtml/cli] is now [@linthtml/linthtml].  

## [0.9.5](https://github.com/linthtml/linthtml/compare/v0.9.4...v0.9.5) (2023-06-02)

### Bug Fixes

* [@linthtml/cli] Remove peer deps to `@linthtml/linthtml` to fix npm ci ([#501](https://github.com/linthtml/linthtml/issues/501))

## [0.9.4](https://github.com/linthtml/linthtml/compare/v0.9.3...v0.9.4) (2022-12-15)

### Bug Fixes

* [@linthtml/linthtml] Correct rule name extract in inline_config "parser" ([#493](https://github.com/linthtml/linthtml/pull/493))

## [0.9.3](https://github.com/linthtml/linthtml/compare/v0.9.3...v0.9.2) (2022-10-08)

### Bug Fixes

* bring back error messages into @linthtml/linthtml package ([ab667f9](https://github.com/linthtml/linthtml/commit/ab667f952d81480f170c7d2803f50b9e2f281800)). Fix [vscode-linhtml#322](https://github.com/linthtml/vscode-linthtml/issues/322)

## [0.9.2](https://github.com/linthtml/linthtml/compare/v0.9.1...v0.9.2) (2022-10-01)

### Bug Fixes

* Correct ignoreFiles options check. Fix the error `path should be a path.relative()d string` reported when using the legacy config format and the the vscode extension.

## [0.9.0](https://github.com/linthtml/linthtml/compare/v0.8.6...v0.9.0) (2022-08-26)

### Breaking 💥

Drop support for node 10 and node 12.

### Refactor 🧰

Move to monorepo and split codebase into 4 packages:

- `@linthtml/cli` - The cli part of LintHTML.
- `@linhtml/dom-utils` - Collection of utils functions to manipulate and check HTML nodes, it's used internally by the rules and the HTML parser.
- `@linthtml/html-parser` - The HTML parser used internally to parse HTML content and get return an AST.
- `@linthtml/linthtml` - The core package, it contains all rules, the linter and the config management.

All packages have also been migrated to Typescript.

### Bug Fixes

- Rule `id-no-dup`, stop reporting error for id like `toString`

## [0.9.0-beta.2](https://github.com/linthtml/linthtml/compare/v0.8.6...v0.9.0-beta.2) (2022-07-28)

### Refactor

All packages have been migrated to Typescript. Thanks to Typescript some bugs havee been found and corrected.

### Docs

There's now an online documentation for [LintHTML](http://linthtml.vercel.app/)

## [0.9.0-beta.1](https://github.com/linthtml/linthtml/compare/v0.8.6...v0.9.0-beta.1) (2022-02-17)

### Refactor 🧰

Move to monorepo and split codebase into 4 packages:

- `@linthtml/cli` - The cli part of LintHTML.
- `@linhtml/dom-utils` - Collection of utils functions to manipulate and check HTML nodes, it's used internally by the rules and the HTML parser.
- `@linthtml/html-parser` - The HTML parser used internally to parse HTML content and get return an AST.
- `@linthtml/linthtml` - The core package, it contains all rules, the linter and the config management.

All packages have also been migrated to Typescript.

## [0.8.6](https://github.com/linthtml/linthtml/compare/v0.8.5...v0.8.6) (2022-03-25)

### Fix

- Remove ignoreFiles property from config in legacy linter ([3eb7972](https://github.com/linthtml/linthtml/commit/3eb79721a7af6569d549ff6c99ad74f9db04b123))

## [0.8.5](https://github.com/linthtml/linthtml/compare/v0.8.4...v0.8.5) (2021-03-08)

### Fix

- Stop reporting error for `--print-config` option

## [0.8.4](https://github.com/linthtml/linthtml/compare/v0.8.3...v0.8.4) (2021-12-17)

### Fix

- preserve and use ignoreFiles property in config files ([089b781](https://github.com/linthtml/linthtml/commit/089b7811576d782f8ada2587f8f3c9955e9c4203))

## [0.8.3](https://github.com/linthtml/linthtml/compare/v0.8.2...v0.8.3) (2021-12-13)

### Fix

- Correctly load plugin's rules ([dbeb654](https://github.com/linthtml/linthtml/commit/dbeb654006a3b44b84313c83a72013a411a7148e))

## [0.8.2](https://github.com/linthtml/linthtml/compare/v0.8.1...v0.8.2) (2021-11-29)

### Fix

- [#413](https://github.com/linthtml/linthtml/issues/413) `attr-order` can now check order for attributes without values ([17dabcb](https://github.com/linthtml/linthtml/commit/17dabcbaa0f4e5cb5cb5eef932ab6b7057436636))

## [0.8.1](https://github.com/linthtml/linthtml/compare/v0.8.0...v0.8.1) (2021-11-27)

### Fix

- [#413](https://github.com/linthtml/linthtml/issues/413) lowercase attr-order config correctly ([78ca538](https://github.com/linthtml/linthtml/commit/78ca5384ccd6f30361a1223674902b2b95c26703))

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
<script src="http://link.com"></script>
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
<p>A simple text with whitespaces before</p>
```

You can find more informations in the [rule doc](./src/rules/no-surrounding-whitespace/README.md).

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

Added new rule `no-surrounding-whitespace` disallowing the presence of encapsulating whitespace, [see rule doc](./src/rules/no-surrounding-whitespace/README.md).

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

Rule [`lang`](./src/rules/lang/README.md) now support simplified Chinese and traditional Chinese.

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

- [link-min-length-4](./src/rules/link-min-length-4)
- [input-btn-req-value-or-title](./src/rules/input-btn-req-value-or-title)
- [button-req-content](./src/rules/button-req-content)
- [label-no-enc-textarea-or-select](./src/rules/label-no-enc-textarea-or-select)
- [fieldset-contains-legend](./src/rules/fieldset-contains-legend)

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
- [FEATURE][cli] Warning message when running beta version

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
<p>foo<span>bar</span></p>
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
- [IMPROVEMENT] Now `indent-style` and `indent-width` catch more errors than before. Checkout [rules](./src/rules/indent-style/README.md) doc for more information about valid/invalid patterns.
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
# [](https://github.com/linthtml/linthtml/compare/v0.9.4...v) (2023-06-02)


### Bug Fixes

* **cli:** Remove @lintmlt/linthtml peer deps ([1d5cb92](https://github.com/linthtml/linthtml/commit/1d5cb92c5f29afd9ddf7271e6450936917063147))
* Correct gitkraken autoCrlf mess ([113ef60](https://github.com/linthtml/linthtml/commit/113ef60de66fdc0e338027e81edd75d459b4fb93))
* run eslint --fix ([ce3800a](https://github.com/linthtml/linthtml/commit/ce3800aba1f8e93556b8a049937d9037bf62a995))

#  (2024-03-03)


### Bug Fixes

* Add nx configuration for test:coverage ([3fcccd6](https://github.com/linthtml/linthtml/commit/3fcccd632c6f9a41d43f5e468f5187301840449d))
* Clear lock file ([606496a](https://github.com/linthtml/linthtml/commit/606496ae84d9fc73e4bc936cc12f2e4a05f72caf))
* Correct as much ts errors as possible ([b9abc1b](https://github.com/linthtml/linthtml/commit/b9abc1beb7471030ad76ecfd238fbbb4909cac7a))
* Correct mocha spec config for linthtml package ([bdd597d](https://github.com/linthtml/linthtml/commit/bdd597df95458d66c13596817cfd509cde0fa0d3))
* Correct some spelling error in cli messages ([bd59725](https://github.com/linthtml/linthtml/commit/bd59725bdbc9ffaa15e7bc833065f7eb595904eb))
* correct test failling due to esm migration ([ce18d13](https://github.com/linthtml/linthtml/commit/ce18d1343867391dcf8064da3d6e4918072a3460))
* correct test with mock import ([418a59d](https://github.com/linthtml/linthtml/commit/418a59d2c43acf6c4276948a8c2fa3b6003f60fe))
* **linthtmt/linthtml:** Add missing dependency to @linthtml/core ([383a5c5](https://github.com/linthtml/linthtml/commit/383a5c53bb3d063ecc4b5c789964e566e3f74aaf))
* remove extra 'Error :' ([7a42f9e](https://github.com/linthtml/linthtml/commit/7a42f9ece5c297945c48cd599ca12f9f43388efc))
* remove ts compilation error ([d756dc0](https://github.com/linthtml/linthtml/commit/d756dc0d87d0f0899cebf932083ff0b6eeafb36b))
* Update build and test scripts in packages ([967b000](https://github.com/linthtml/linthtml/commit/967b0003e9f02514068313a323342598c928b147))
* Update path in docusaurus scripts and disable API page ([ffa9cfa](https://github.com/linthtml/linthtml/commit/ffa9cfaf0407bcdef8c658519485b6e6003092a0))
* Update ts path in docusaurus config ([17021f7](https://github.com/linthtml/linthtml/commit/17021f7962345105257dcc7d00c06a5cbeececfe))



