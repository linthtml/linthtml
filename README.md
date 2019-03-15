# LintHTML

[![npm version](http://img.shields.io/npm/v/lintHTML.svg?style=flat-square)](https://npmjs.org/package/lintHTML)
[![license](http://img.shields.io/npm/l/lintHTML.svg?style=flat-square)](https://npmjs.org/package/lintHTML)
[![Build Status](https://travis-ci.org/linthtml/lintHTML.svg?branch=develop)](https://travis-ci.org/linthtml/lintHTML)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flinthtml%2FlintHTML.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Flinthtml%2FlintHTML?ref=badge_shield)

> An unofficial html5 linter and validator.

_LintHTML uses [htmlparser2](https://www.npmjs.com/package/htmlparser2) to parse your html._

## Installation and Usage

Prerequisites: [Node.js](https://nodejs.org/en/) (>=6.14), npm version 3+.

There are two ways to install LintHTML: globally and locally.

### Local Installation and Usage

If you want to include LintHTML as part of your project's build system, we recommend installing it locally. You can do so using npm:

```shell
npm install linthtml --save-dev
```

You should then set up a configuration file:

```shell
./node_modules/.bin/linthtml --init
```

After that, you can run LintHTML on any file or directory like this:

```shell
./node_modules/.bin/linthtml yourfile.html
```

### Global Installation and Usage

If you want to make LintHTML available to tools that run across all of your projects, we recommend installing LintHTML globally. You can do so using npm:

```shell
npm install -g linthtml
```

You should then set up a configuration file:

```shell
linthtml --init
```

After that, you can run LintHTML on any file or directory like this:

```shell
linthtml yourfile.html
```

<!-- Note: `linthtml --init` is intended for setting up and configuring linthtml on a per-project basis and will perform a local installation of ESLint and its plugins in the directory in which it is run. If you prefer using a global installation of ESLint, any plugins used in your configuration must also be installed globally. -->

## Rules

Current list of rules and deprecations can be found in [docs/rules.md](docs/rules.md).

Rules can be configured using e a JavaScript, JSON or YAML file. This can be in the form of an .linthtml.* file or an , `linthtmlConfig` field in a `package.json` file, both of which LintHTML will look for and read automatically, or you can specify a configuration file on the command line using the `--config` option.

### Other

We have a some other solutions to run linthtml

This module doesn't provide any interface on its own. It is highly recommended that
you use one of the following modules to run the linter:

* [`gulp-linthtml`](https://github.com/linthtml/gulp-linthtml): a gulp interface for lintHTML (Coming soon 🚧)
* [`linthtml-loader`](https://github.com/linthtml/linthtml-loader): lintHTML loader for webpack (Coming soon 🚧)
* [`broccoli-linthtml`](https://github.com/linthtml/broccoli-linthtml): Integrates HTML linting with lintHTML as part of your Broccoli build pipeline. (Coming soon 🚧)

## Contributing

Contribution are welcome, please make sure to use the proper github tag on your issue/PR.

* `cli` : For anything that is related to the cli interface of linthml
* `rule` : For anything that is related the rules (bugs, improvement, docs, new rule...)
* `core` : For anything that is related to the core of linthml (file parsing, plugin system...)

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flinthtml%2FlintHTML.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Flinthtml%2FlintHTML?ref=badge_large)
