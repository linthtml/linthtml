# line-max-len-ignore-regex

⚠ This is not a rule.

It's a setting that will be used the rule [line-max-len](../line-max-len/README.md) to ignore some lines.

A string giving a regular expression, a RegExp object, or `false`. If set, lines with names matching the given regular expression are ignored for the `line-length` rule. For example, lines with long `href` attributes can be excluded with regex `href`.

There're two ways to set a value for this config:

1. If you use the legacy config format(inherited for HTMLLint), this setting will be configured alongside rules.

  ```json
  {
      "line-max-len": 80,
      "line-max-len-ignore-regex": "pattern-to-ignore"
  }
  ```

2. If you use the [new config format](../../../../../doc/docs/user-guide/configuration.md), this setting need to be configured at the root level of the config file.

  ```json
  {
      "line-max-len-ignore-regex": "pattern-to-ignore",
      "rules": {
        "line-max-len": [true, 80]
      }
  }
  ```
