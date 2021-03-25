# attr-name-ignore-regex

⚠ This is not a rule.
It's a setting that will be used by real rules to ignore some attribute based on their names.

There're two ways to set a value for this config:

1. If you use the legacy config format(inherited for HTMLLint), this setting will be configured alongside rules.

  ```json
  {
      "attr-name-style": "lowercase",
      "attr-name-ignore-regex": "attribute-to-ignore"
  }
  ```

2. If you use the [new config format](../../../docs/configuration.md), this setting need to be configured at the root level of the config file.

  ```json
  {
      "attr-name-ignore-regex": "attribute-to-ignore",
      "rules": {
        "attr-name-style": [true, "lowercase"]
      }
  }
  ```
