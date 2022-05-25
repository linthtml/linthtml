# Migration guide

- [Migrate from HTMLLint](#htmllint-migration)
- [Migrate to LintHTML 0.3.0](#030-upgrade-guide)

## HTMLLint migration

LintHTML is initially a fork of [HTMLLint](https://github.com/htmllint/htmllint) and intent on staying compatible with it until the release of the v1. Migrating to LintHTML from [HTMLLint](https://github.com/htmllint/htmllint) is not complicate.

First remove all the htmllint-related packages you were using:

```shell
npm uninstall htmllint htmllint-cli
```

Then rename the file `.htmlintrc` to `.linthtmlrc`.

Finally, install LintHTML:

```shell
npm install @linthtml/linthtml --save-dev
```

### Deprecated rules

You might want to remove the rules `indent-delta` and `indent-width-cont` from there in case you where using them, since LintHTML's indent style checker deals with those aspects out of the box.

### Inline config

Since the release [0.5.0](https://github.com/linthtml/linthtml/releases/tag/0.5.0) it's no longer possible to use presets in inline config.
The following no longer work.

```html
<!-- linthtml-configure preset="$default -->
<!-- linthtml-configure preset="$none -->
```

## 0.3.0 Upgrade guide

LintHTML v0.3.0 is the first version to add a new feature that are not compatible with [HTMLLint](https://github.com/htmllint/htmllint).
This version adds a new format for the configuration file that should be easier to use. The new format should be familiar to anyone already using other linter like ESlint and Stylelint.
⚠️ it's not an obligation to use this new format, you can stick with the legacy one. However, the legacy format won't be supported after LintHTML v1.

To migrate from the legacy format to the new one you need to do two things:

- Nest all rules under `rules`, except `text-ignore-regex`, `raw-ignore-regex`, `attr-name-ignore-regex`, `id-class-ignore-regex` and `line-max-len-ignore-regex`.

```diff
{
  "text-ignore-regex": false,
  "raw-ignore-regex": false,
-  "indent-style": ...,
-  "indent-width": ...
+  "rules": {
+    "indent-style": ...,
+    "indent-width": ...,
+  }
}
```

- Update every rules configuration.
With the legacy config format, rules are configured like this: `"rule name": "rule config"`.
With the new config format, rules are configured like this :

```json
"ruleName": [
  true,
  "rule config"
]
```

The first value can be `true`, `false`, `"error"`, `"warning"` or `"off"`.
The second value can be anything, have a look to the rule's documentation if you want to know.

Here's an example:

```diff
- // legacy config
- "indent-style": "space"
+ // new config
+ "indent-style": [
+    "error",
+    "space"
+ ]
```

Some rules does not accept configurations, for those rules you can use a simple string or boolean value in your config file:

```
  "attr-validate": true
  // or
  "attr-validate": false
  // or 
  "attr-validate": "error"
  // or
  "attr-validate": "warning"
```
