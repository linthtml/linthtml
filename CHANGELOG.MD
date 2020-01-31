# Changelog

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

- [link-min-length-4](./lib/rules/link-min-length-4)
- [input-btn-req-value-or-title](./lib/rules/input-btn-req-value-or-title)
- [button-req-content](./lib/rules/button-req-content)
- [label-no-enc-textarea-or-select](./lib/rules/label-no-enc-textarea-or-select)
- [fieldset-contains-legend](./lib/rules/fieldset-contains-legend)

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
- [FEATURE][CLI] Warning message when running beta version

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
<p>
  foo<span>bar</span>
</p>
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
- [IMPROVEMENT] Now `indent-style` and `indent-width` catch more errors than before. Checkout [rules](./lib/rules/indent-style/README.md) doc for more information about valid/invalid patterns.
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
