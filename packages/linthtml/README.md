# LintHTML

[![npm version](https://img.shields.io/npm/v/@linthtml/linthtml.svg?style=flat-square)](https://npmjs.org/package/@linthtml/linthtml)
[![license](https://img.shields.io/npm/l/@linthtml/linthtml.svg?style=flat-square)](https://npmjs.org/package/@linthtml/linthtml)
[![codebeat badge](https://codebeat.co/badges/b16712c0-c863-4fda-8ea2-75dacd0faf1a)](https://codebeat.co/projects/github-com-linthtml-linthtml-develop)
[![Coverage Status](https://coveralls.io/repos/github/linthtml/linthtml/badge.svg?branch=develop)](https://coveralls.io/github/linthtml/linthtml?branch=develop)

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

If you want to read about alternative installation and usage methods, have a look to the [installation and usage](./doc/docs/user-guide/installation-and-usage.md) page in the documentation.
