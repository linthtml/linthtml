---
title: Installation and Usage
sidebar_label: Installation and Usage
---

Although the installation and usage instructions given in the general README are suitable for most use cases, there might be some situations in which you might prefer the alternative methods explained in here.

## Installation

### Locally

In most cases you'll want to include LintHTML as part of your project's build system. To do so, you can install LintHTML either with `npm`:

```shell
npm install @linthtml/linthtml --save-dev
```

...or with `yarn`:

```shell
yarn add @linthtml/linthtml --dev
```

And initialize a LintHTML configuration file (`.linthtmlrc`) either with `npx`:

```shell
npx linthtml --init
```

...or executing directly LintHTML's bin:

```shell
./node_modules/.bin/linthtml --init
```

### Globally

If you want to make LintHTML available to tools that run across all of your projects, you might prefer to install LintHTML globally, which can be achieved either with `npm`:

```shell
npm install -g @linthtml/linthtml
```

...or with `yarn`:

```shell
yarn global add @linthtml/linthtml
```

And initialize a LintHTML configuration file (`.linthtmlrc`) running:

```shell
linthtml --init
```

## Usage

You can run LintHTML on any file like this with `npx`:

```shell
npx linthtml 'yourfile.html'
```

If you installed LintHTML locally you might prefer to specify the full path of the bin:

```shell
./node_modules/.bin/linthtml 'yourfile.html'
```

Whereas if you installed it globally, running it this way should be enough:

```shell
linthtml 'yourfile.html'
```

Running LintHTML on all the HTML files in the certain directory/project must be one of the most common use cases. For example, if all your code is located inside a `src/` folder, you can run:

```shell
npx linthtml 'src/**/*.html'
```
