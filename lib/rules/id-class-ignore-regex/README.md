# id-class-ignore-regex

⚠ This is not a rule.
It's a setting that will be used by real rules to ignore some HTML ids and CSS class based on their names.

There're two ways to set a value for this config:

1. If you use the legacy config format(inherited for HTMLLint), this setting will be configured alongside rules.

  ```json
  {
      "attr-name-style": "lowercase",
      "id-class-ignore-regex": "id or class to ignore"
  }
  ```

2. If you use the [new config format](../../../docs/configuration.md), this setting need to be configured at the root level of the config file.

  ```json
  {
      "id-class-ignore-regex": "id or class to ignore",
      "rules": {
        "attr-name-style": [true, "lowercase"]
      }
  }
  ```
