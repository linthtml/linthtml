# Configuration

_⚠️ this is only for the new [config format](https://github.com/linthtml/linthtml/releases#new-config-file-format) introduced in the 0.3.0_

LintHTML use [cosmiconfig](https://davidtheclark/cosmiconfig) to find and load your configuration. It will looks for the following possible sources:

- a `linthtml` property in `package.json`
- a `.linthtmlrc`, `.linthtmlrc.json` or `.linthtmlrc.yml` file
- a `.linthtmlrc.js` file exporting a JS object

You can use the `--config` option to manually target a config file.

The configuration object has the following properties:

## rules

Rules determine what the linter looks and test. All rules are listed here [rules](./rules.md).
The `rules` property is an object whose keys are rule names and values are rule configuration. For example:

```json
{
  "rules": {
    "line-end-style": [
      true,
      "lf"
    ]
  }
}
```

Each rule configuration fits one of the following formats:

- `false`, `true`, `"error"`, `"warning"` or `"off"`. `false` and `"off"` turn the rule off. `"warning"` will make the rules report a warning instead of an error.
- an array with two values (`[activation option, rule configuration]`)

## ignoreFiles

You can provide a glob or array of globs to ignore specific files.

For example, you can ignore all html files in the `foo` folder.

```json
{
  "ignoreFiles": ["foo/*.html"]
}
```

LintHTML by default ignore the `node_modules` directory and use the content of the `.gitignore` file.
This is overriden if `ignoreFiles` is hidden.

_Note: If your `ignoreFiles` list is large use the [`.linthtmlignore`](./ignore-code.md#entire-files) file_
