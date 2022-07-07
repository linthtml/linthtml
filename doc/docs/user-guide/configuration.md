---
title: Configuration
sidebar_label: Configuration
---

_⚠️ this is only for the new config format added in the version [0.3.0](https://github.com/linthtml/linthtml/releases/tag/0.3.0)_

LintHTML use [cosmiconfig](https://davidtheclark/cosmiconfig) to find and load your configuration. It will looks for the following possible sources:

- a `linthtmlConfig` property in `package.json`
- a `.linthtmlrc`, `.linthtmlrc.json` or `.linthtmlrc.yml` file
- a `.linthtmlrc.js` file exporting a JS object

You can use the `--config` option to manually target a config file.

The configuration object has the following properties:

- `rules` - [Contains the list of activated rules and their config](#activate-rules)
- `ignoreFiles` - [Can be used to exclude files from linting](#exclude-files-from-linting)
- `extends` - [Use shared configurations](#using-a-shareable-configuration-package)

## Activate rules

Rules determine what the linter looks for and test. All rules are listed here [rules](./rules/list.md).
The `rules` property is an object whose keys are rule names and values are rule configuration. For example:

```json
{
  "rules": {
    "line-end-style": [
      true,
      "lf"
    ]
  }
}
```

Each rule configuration fits one of the following formats:

- `false`, `true`, `"error"`, `"warning"` or `"off"`.
  - `false` and `"off"` turn the rule off.
  - `"warning"` will make the rules report a warning instead of an error.
- an array with two values (`[activation option, rule configuration]`)

## Exclude files from linting

You can provide a glob or array of globs to ignore specific files.

For example, you can ignore all HTML files in the `foo` folder.

```json
{
  "ignoreFiles": ["foo/*.html"]
}
```

LintHTML by default ignore the `node_modules` directory and use the content of the `.gitignore` file.
This is overridden if `ignoreFiles` is hidden.

_Note: If your `ignoreFiles` list is large use the [`.linthtmlignore`](./ignore-code.md#entire-files) file_

## Extending Configuration Files

A configuration file can extend the set of enabled rules from base configurations.

The `extends` property value is either:

- a string that specifies a configuration (either a path to a config file, the name of a shareable config)
- an array of strings: each additional configuration extends the preceding configurations

LintHTML extends configurations recursively, so a base configuration can also have an `extends` property. Relative paths and shareable config names in an `extends` property are resolved from the location of the config file where they appear.

The `rules` property can do any of the following to extend (or override) the set of rules:

- enable additional rules
<!-- - change an inherited rule's severity without changing its options: <---- Need to test - Nope doesn't work at the moment
  - Base config: `"id-style": ["error", "underscore"]`
  - Derived config: `"id-style": "warn"`
  - Resulting actual config: `"id-style": ["warn", "underscore"]` -->
- override options for rules from base configurations:
  - Base config: `"attr-quote-style": ["error", "single"]`
  - Derived config: `"attr-quote-style": ["error", "double"]`
  - Resulting actual config: `"attr-quote-style": ["error", "double"]`

### Using a shareable configuration package

A [shareable configuration](./shareable-configs.md) is an npm package that exports a configuration object. Make sure the package has been installed in a directory where LintHTML can require it.

The `linthtml --init` command can create a configuration so you can extend a popular style guide (for example, `@linhtml/config-xxx`).

Example of a configuration file in YAML format:

```yaml
extends: @linthtml/config-xxx
rules:
  line-max-len:
    - error
    - 80
  id-style: warn
```

_LintHTML as a shareable configuration package you can use [@linhtml/linthtml-config-recommended](https://github.com/linthtml/linthtml-config-recommended)_

### Using a configuration file

The extends property value can be an absolute or relative path to a base configuration file. LintHTML resolves a relative path to a base configuration file relative to the configuration file that uses it.

Example of a configuration file in JSON format:

```json
{
    "extends": [
        "./node_modules/coding-standard/linthtmlDefaults.js",
        "./node_modules/coding-standard/.linthtmlrc-webc"
    ],
    "rules": {
        "id-style": "warn"
    }
}
```

### Using a custom parser

By default, LintHTML uses [htmlparser2](https://github.com/fb55/htmlparser2) as its parser but with a custom AST format in output. You can optionally specify that a different parser should be used in your configuration file so long as the parser meets the following requirements:

1. It must be a Node module, loadable from the config file where the parser is used. Usually, this means you should install the parser package separately using npm.
2. It must conform to the parser [interface](../developer-guide/custom-parser.md).

To indicate the npm module to use as your parser, specify it using the `parser` option in your `.linthtmlrc` file.
For example, the following specifies to use `linthtml-pug` parser:

```json
{
    "parser": "@linthtml/linthtml-pug",
    "rules": {
    }
}
```

Here's a list of parser that are compatible with LintHTML:

- `@linthtml/linthtml-pug` - A wrapper around the [PUG](https://pugjs.org/) parser that makes it compatible with LintHTML.

### Using plugins

It's possible to extends the capabilities of LintHTML by providing more rules using Plugins.

Plugins should be listed in the `plugins` option in your `.linthtmlrc` file, the property accept either a string or an array of strings.

For example:

```json
{
    "plugins": ["@linthtml/linthtml-pug", "linthtml-plugin-custom"],
    "rules": {
    }
}
```

To learn more about Plugins and how to expose rules read the [Plugins documentation page](../developer-guide/plugins.md).
