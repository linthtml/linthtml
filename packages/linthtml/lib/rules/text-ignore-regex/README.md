# text-ignore-regex

⚠ This is not a rule ⚠

A string giving a regular expression, a RegExp object, or `false`. If set, text matching the given regular expression is ignored by rules which apply to raw text (currently, just `spec-char-escape`). For example, `\\[{.*?}\\]` will exclude text wrapped in `[{...}]`. Note that such text may still cause the input html to parse incorrectly, which could result in errors in other rules later. To remove such text before parsing, use `raw-ignore-regex`.
