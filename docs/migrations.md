# Migration guide

- [](Migrate from HTMLLint)
- Migrate to LintHTML 0.3.0

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

You might want to remove the rules `indent-delta` and `indent-width-cont` from there in case you where using them, since LintHTML's indent style checker deals with those aspects out of the box.

## 0.3.0 Upgrade guide

LintHTML v0.3.0 is the first version to add a new feature that are not compatible with [HTMLLint](https://github.com/htmllint/htmllint).
This version add a new format for the configuration file that should be easier to use. The new format should be farmiliar to anyone already using other linter like ESlint and Stylelint.
⚠️ it's not an obligation to use this new format, you can stick withe the legacy one. However the legacy format won't be supported after LintHTML v1.

To migrate from the legacy format to the new one you need to do 2 things:

- Nest all rules under `rules`, except `spec-char-escape`, `text-ignore-regex`, `raw-ignore-regex`, `attr-name-ignore-regex`, `id-class-ignore-regex` and `line-max-len-ignore-regex`.

```diff
{
  "spec-char-escape": false,
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

- Update every rule configuration.
With the legacy config format, rules are configured like this: `"rule name": "rule config"`.
With the new config format, rules are configured like this :

```
"ruleName": [
  true,
  "rule config"
]
```

The first value can be `true`, `false`, `"error"` or `"off"`.
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
