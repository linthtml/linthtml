# LintHTML

[![npm version](https://img.shields.io/npm/v/@linthtml/linthtml.svg?style=flat-square)](https://npmjs.org/package/@linthtml/linthtml)
[![license](https://img.shields.io/npm/l/@linthtml/linthtml.svg?style=flat-square)](https://npmjs.org/package/@linthtml/linthtml)
[![codebeat badge](https://codebeat.co/badges/b16712c0-c863-4fda-8ea2-75dacd0faf1a)](https://codebeat.co/projects/github-com-linthtml-linthtml-develop)
[![Coverage Status](https://coveralls.io/repos/github/linthtml/linthtml/badge.svg?branch=develop)](https://coveralls.io/github/linthtml/linthtml?branch=develop)
<!-- [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flinthtml%2Flinthtml.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Flinthtml%2Flinthtml?ref=badge_shield) -->

> The HTML5 linter and validator you need.

LintHTML is a fork of [htmllint](https://github.com/htmllint/htmllint) featuring a built-in CLI and multiple bug fixes and improvements.
The migration from htmllint to LintHTML is easy, as all htmllint's rules can be used with LintHTML – just follow this [simple guide](#migrate-from-htmllint).

## Installation and Usage

You can install LintHTML either locally or globally.
For most cases we recommend the former, which can be achieved this way with npm:

```shell
npm install @linthtml/linthtml --save-dev
```

You should then init a configuration file:

```shell
npx linthtml --init
```

This will generate a file `.linthtmlrc` in the current directory.

After that, you can run LintHTML on any file or directory like this:

```shell
npx linthtml 'yourfile.html'
npx linthtml 'src/**/*.html'
```

If you want to read about alternative installation and usage methods, have a look at the extended section in [docs/installation_and_usage.md](docs/installation_and_usage.md).

## Migrate from htmllint

To migrate from [htmllint](https://github.com/htmllint/htmllint) to LintHTML, first remove all the htmllint-related packages you were using:

```shell
npm uninstall htmllint htmllint-cli
```

Then rename the file `.htmlintrc` to `.linthtmlrc`.
You might want to remove the rules `indent-delta` and `indent-width-cont` from there in case you were using them since LintHTML's indent style checker deals with those aspects out of the box.

Finally, install LintHTML:

```shell
npm install @linthtml/linthtml --save-dev
```

## Rules

The list of current rules and deprecations can be found in [docs/rules.md](docs/rules.md).

### Global Configuration

By default, LintHTML will look for a `JSON`, `YAML`, or `JavaScript` file named `.linthtmlrc.*` or a `linthtmlConfig` section in `package.json`.
Anyway, you can specify a custom configuration file using the `--config` option when running LintHTML in the command line.
See our documentation about [configuration](./docs/configuration.md) to see how to configure rules, use custom parser, plugins...

### Inline Configuration

Sometimes it is necessary to disable a rule or tweak the configuration for a specific line, block or HTML file.
This might be the case, for example, for an inline SVG block of code.
This can be achieved by using inline configurations.

Inline configurations are HTML comments beginning with the keyword `linthtml-XXX`.

`XXX` can be replaced with the following values, which are called instructions.
Instructions have different effects:

- `configure` : change a rule configuration for the HTML nodes that follow
- `enable` : activate a rule which was has deactivated previously
- `disable` : disable a rule

#### Configure instruction

Multiple rules can be set in a single inline configuration comment.
Values must be surrounded with double/single quotes if they contain spaces, and must be either a valid value for the rule (encoded in pretty-much-JSON) or the string `$previous` (which is a special value that recalls the former value of the rule for your convenience).

Some examples:

* change the `tag-bans` rule value

```html
<!-- linthtml-configure tag-bans="['p','style']" -->
<!-- linthtml-configure tag-bans=['p','style'] -->
```

* turn off the `attr-bans` rule

```html
<!-- linthtml-configure attr-bans="false" -->
<!-- linthtml-configure attr-bans=false -->
<!-- linthtml-configure attr-bans="off" -->
```

_We recommend using the enable/disable instructions instead 😉_

* turn on the `attr-bans` rule

```html
<!-- linthtml-configure attr-bans="true" -->
<!-- linthtml-configure attr-bans=true -->
```

_⚠️ you can only turn on rules that have been deactivated by an inline config_
_We recommend using the enable/disable instructions instead 😉_

* restore the previous value of the `tag-bans` rule
_⚠️ works only with the legacy config at the moment_

```html
<!-- linthtml-configure tag-bans="$previous" -->
```

It's worth noting that inline configurations only affect the file they're on, so if they are not explicitly reversed with the `$previous` value, they will just apply until the end of the file.

#### Disable/Enable instructions

The `disable` and `enable` instructions only deactivate and activate rules for a specific part of a document.

Some examples:

* turn off the `attr-bans` rule

```html
<!-- linthtml-disable attr-bans -->
```

* turn on the `attr-bans` rule

```html
<!-- linthtml-enable attr-bans -->
```

_⚠️ you can only turn on rules that have been deactivated by an inline config_

Multiple rules can be provided to the instructions as long as they are separated by a `,`.

```html
<!-- linthtml-disable attr-bans,indent-style,id-style -->
<!-- Spaces can be added to improve readability -->
<!-- linthtml-disable attr-bans, indent-style, id-style -->
```

When no rules are provided to the instructions, the instructions will affect all rules available for the document that is analysed.

## Ecosystem

Apart from the built-in CLI, you might want to use some of the following tools to integrate LintHTML in different scenarios:

* [`vscode-linthtml`](https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-linthtml): an extension for the VSCode IDE
* [`gulp-linthtml`](https://github.com/linthtml/gulp-linthtml): a gulp interface for LintHTML

🚧 Coming soon:

* `linthtml-loader`: LintHTML loader for webpack
* `broccoli-linthtml`: Integrates HTML linting with LintHTML as part of your Broccoli build pipeline

## Contributing

Contributions are welcome, please make sure to use the proper GitHub tag on your issue/PR.

* `cli`: anything related to LintHTML's CLI
* `rule`: anything related to the rules (bugs, improvements, docs, new rules...)
* `core`: anything related to LintHTML's core (file parsing, plugin system...)
