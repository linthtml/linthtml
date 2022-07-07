---
title:  Writing plugins
sidebar_label:  Writing plugins
---

# Add custom Rules using Plugins

Each plugin is an npm module with a name.
It's recommanded to use the format `linthtml-plugin-<plugin-name>`. You can also use scoped packages in the format of `@<scope>/linthtml-plugin-<plugin-name>` or even `@<scope>/linthtml-plugin`.

## Expose Rules in Plugins

Plugins can expose additional rules for use in LintHTML. To do so, the plugin must export an array of rules objects under the property `rules`.
Each rules should contains a property `name` matching the following pattern `<plugin-name>/<rule-id>`.
For exemple:

```js
module.exports = {
  rules: [{
    name: "a11y/heading-level",
    lint(node, rule_config, { report }) {
      // rule implementation ...
    }
  }]
};
```

To use the rule in LintHTML, you would use same pattern (`<plugin-name>/<rule-id>`).
So to activate/configure the rule `"a11y/heading-level"`, you would have to write the following in your LintHTML config file.

```json
{
    "rules": {
        "a11y/heading-level": "error"
    }
}
```

### Rules implementation

The source file for a rule exports an object with the following properties.

* `name` (string) the rule name, this property will be used to print the rule name along side an reported issue.
* `validateConfig` (function) this function is optional and will be used to validate the config provided to the rule in the config file.
  This is usefull when you have a rule that only accept `numbers` or `strings` as config or if you want to limit the config possibility. For example the rule `indent-style` only accept `tabs`, `spaces` and `nonmixed` as config.
* `lint` (function) this function will be called for every nodes in the abstract syntax tree (AST as defined [here](./custom-parser#the-ast-specification)) for the documents that are linted.
  This function receive in input 3 parameters:
  
  * `node` ([node spec](./custom-parser#the-ast-specification) the node traversed).
  * `rule_config` (any) the config for the rule. By default, it's the rule config defined in the `linthtmlrc.*` files but it can also be the config overrides defined in an [inline instruction](../index.md#inline-configuration)
  * `options` (object) this parameter contains the following property:
    * `report` (function) this is the function to use to report a lint issue. This function takes as argument the following object
      * `position` (Position see [here](./custom-parser#the-ast-specification)) Location of the issue
      * `message` (string) Message describing the issue
    * `global_config` (object) [_deprecated_] An object containing the config of all activated rules.
