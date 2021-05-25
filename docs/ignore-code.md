# Ignore code

You can ignore :

<!-- - within files -->
- entire files

<!-- ## Within files -->

## Entire files

You can use a `.linthtmlignore` files to ignore specific files. For example:

```
dist/*.html
vendor/*.thml
```

The patterns in your `.linthtmlignore` file must match [`.gitignore` syntax](https://git-scm.com/docs/gitignore) (The package [`node-ignore`](https://www.npmjs.com/package/ignore) is used to parse the patterns). _The patterns in `.linthtmlignore` are always relative to `process.cwd()`._

LintHTML looks for a `.linthtmlignore` file in `process.cwd()`.

_Alternatively, you can add an [`ignoreFiles` property](./configuration.md#ignorefiles) within your configuration object._
