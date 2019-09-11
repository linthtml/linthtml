# LintHTML

[![npm version](https://img.shields.io/npm/v/@linthtml/linthtml.svg?style=flat-square)](https://npmjs.org/package/@linthtml/linthtml)
[![license](https://img.shields.io/npm/l/@linthtml/linthtml.svg?style=flat-square)](https://npmjs.org/package/@linthtml/linthtml)
[![Build Status](https://travis-ci.org/linthtml/linthtml.svg?branch=develop)](https://travis-ci.org/linthtml/linthtml)
[![codebeat badge](https://codebeat.co/badges/b16712c0-c863-4fda-8ea2-75dacd0faf1a)](https://codebeat.co/projects/github-com-linthtml-linthtml-develop)
[![Coverage Status](https://coveralls.io/repos/github/linthtml/linthtml/badge.svg?branch=develop)](https://coveralls.io/github/linthtml/linthtml?branch=develop)
<!-- [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flinthtml%2Flinthtml.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Flinthtml%2Flinthtml?ref=badge_shield) -->

> An unofficial HTML5 linter and validator.

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
You might want to remove the rules `indent-delta` and `indent-width-cont` from there in case you where using them, since LintHTML's indent style checker deals with those aspects out of the box.

Finally, install LintHTML:

```shell
npm install @linthtml/linthtml --save-dev
```

## Rules

Current list of rules and deprecations can be found in [docs/rules.md](docs/rules.md).

### Global Configuration

By default, LintHTML will look for a JSON, YAML or JavaScript file named `.linthtmlrc.*` or a `linthtmlConfig` section in `package.json`.
Anyway, you can specify a custom configuration file using the `--config` option when running LintHTML in the command line.

### Inline Configuration

Sometimes it is necessary to disable certain rules for a specific line, block or HTML file.
This might be the case, for example, for an inline SVG block of code.
This can be achieved with inline configurations.

Inline configurations are HTML comments beginning with the keyword `linthtml-configure`:

```html
<!-- linthtml-configure [rule]="[value]" -->
```

Multiple rules can be set in a single inline configuration comment.
Values must be surrounded with double/single quotes if they contain spaces, and must be either a valid value for the rule (encoded in pretty-much-JSON), or the string `$previous` (which is special value that recalls the former value of the rule for your convenience).

Some examples:

* turn off the `attr-bans` rule

```html
<!-- linthtml-configure attr-bans="false" -->
```

* change the `tag-bans` rule value

```html
<!-- linthtml-configure tag-bans="['p','style']" -->
```

* restore the previous value of the `tag-bans` rule

```html
<!-- linthtml-configure tag-bans="$previous" -->
```



It's worth noting that inline configurations only affect the file they're on, so if they are not explicitly reversed with the `$previous` value, they will just apply until the end of the file.

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

<!-- ## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flinthtml%2Flinthtml.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Flinthtml%2Flinthtml?ref=badge_large) -->