---
title: Ignoring code
sidebar_label: Ignoring code
---

You can ignore :

- within files
- entire files

## Within files

You can temporarily turn off rules using special comments in the HTML file. For example, you can either turn all the rules off:

```html
<!-- linthtml-disable -->
<p>All rules are disabled here</p>
<!-- linthtml-enable -->
<p>All rules are enabled here</p>
```

Or you can turn off individual rules:

- turn off the `attr-bans` rule

```html
<!-- linthtml-disable attr-bans -->
```

- turn on the `attr-bans` rule

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

## Entire files

You can use a `.linthtmlignore` files to ignore specific files. For example:

```
dist/*.html
vendor/*.thml
```

The patterns in your `.linthtmlignore` file must match [`.gitignore` syntax](https://git-scm.com/docs/gitignore) (The package [`node-ignore`](https://www.npmjs.com/package/ignore) is used to parse the patterns). _The patterns in `.linthtmlignore` are always relative to `process.cwd()`._

LintHTML looks for a `.linthtmlignore` file in `process.cwd()`.

_Alternatively, you can add an [`ignoreFiles` property](./configuration.md#ignorefiles) within your configuration object._
