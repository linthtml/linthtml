# Rules

Here is the list of all rules available in LintHTML

| Rule name                                                                                   | Description                                                                               |
| :------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------- |
|                                                                                             |                                                                                           |
| [attr-bans](./../lib/rules/attr-bans/README.md)                                             | Specify a list of disallowed HTML attributes                                              |
| [attr-name-style](./../lib/rules/attr-name-style/README.md)                                 | Enforce naming conventions for HTML tag name                                              |
| [attr-name-ignore-regex](./../lib/rules/attr-name-style/README.md#attr-name-ignore-regex)   |                                                                                           |
| [attr-new-line](./../lib/rules/attr-new-line/README.md)                                     | Specify the numbers of HTML attributes allowed on one line                                |
| [attr-no-dup](./../lib/rules/attr-no-dup/README.md)                                         | Disallow duplications of HTML attributes within the same tag                              |
| [attr-no-unsafe-char](./../lib/rules/attr-no-unsafe-char/README.md)                         | Disallow the use of unsafe unicode char in attributes values                              |
| [attr-order](./../lib/rules/attr-order/README.md)                                           | Specify the order of attributes in an HTML tag.                                           |
| [attr-quote-style](./../lib/rules/attr-quote-style/README.md)                               | Enforce the consistent use of quotes.                                                     |
| [attr-req-value](./../lib/rules/attr-req-value/README.md)                                   | Enforce the presence of a value for an HTML attribute                                     |
| [attr-validate](./../lib/rules/attr-validate/README.md)                                     | Validate that attributes are correctly written                                            |
| [button-req-content](./../lib/rules/button-req-content/README.md)                           | Enforce the presence of a text content for a button                                       |
| [class-no-dup](./../lib/rules/class-no-dup/README.md)                                       | Disallow the presence of the same className within the `class` attribute                  |
| [class-style](./../lib/rules/class-style/README.md)                                         | Enforce naming convention for CSS classes                                                 |
| [doctype-first](./../lib/rules/doctype-first/README.md)                                     | Enforce the presence of `<!DOCTYPE ...>` on top of an HTML document                       |
| [doctype-html5](./../lib/rules/doctype-html5/README.md)                                     | Enforce the use of the HTML5 doctype                                                      |
| [fieldset-contains-legend](./../lib/rules/fieldset-contains-legend/README.md)               | Every `fieldset` element should contain a `legend` element                                |
| [fig-req-figcaption](./../lib/rules/fig-req-figcaption/README.md)                           | Enforce the presence of the tag `<figcaption>` inside a `<figure>` tag.                   |
| [focusable-tabindex-style](./../lib/rules/focusable-tabindex-style/README.md)               | Disallow the use of positive tabindex (>1)                                                |
| [head-req-title](./../lib/rules/head-req-title/README.md)                                   | Enforce the presence of a `<title>` inside `<head>`                                       |
| [head-valid-content-model](./../lib/rules/head-valid-content-model/README.md)               |                                                                                           |
| [href-style](./../lib/rules/href-style/README.md)                                           | `href` must be set with absolute or relative links.                                       |
| [html-req-lang](./../lib/rules/lang/README.md#html-req-lang)                                | Enforce the presence of the `lang` attribute on any `<html>` tag                          |
| [html-valid-content-model](./../lib/rules/html-valid-content-model/README.md)               |                                                                                           |
| [id-class-ignore-regex](./../lib/rules/id-style/README.md#id-class-ignore-regex)            |                                                                                           |
| [id-class-no-ad](./../lib/rules/id-class-no-ad/README.md)                                   |                                                                                           |
| [id-class-style](./../lib/rules/id-style/README.md#id-class-style)                          | Enforce naming convention for HTML ids and CSS classes                                    |
| [id-no-dup](./../lib/rules/id-no-dup/README.md)                                             | Disallow duplications of HTML ids within the same document                                |
| [id-style](./../lib/rules/id-style/README.md)                                               | Enforce naming convention for HTML ids                                                    |
| [img-req-alt](./../lib/rules/img-req-alt/README.md)                                         | Enforce the presence of a none empty `alt` attribute on `<img>`                           |
| [img-req-src](./../lib/rules/img-req-src/README.md)                                         | Enforce the presence of a none empty `src` attribute on `<img>`                           |
| indent-delta (deprecated)                                                                   |                                                                                           |
| [indent-style](./../lib/rules/indent-style/README.md)                                       | Specify indentation style (`tab` or `space`)                                              |
| [indent-width](./../lib/rules/indent-style/README.md#indent-width)                          | Specify indentation width                                                                 |
| indent-width-cont (deprecated)                                                              |                                                                                           |
| [input-btn-req-value-or-title](./../lib/rules/input-btn-req-value-or-title/README.md)       | Enforce the presence of a label for `<button>`                                            |
| [input-radio-req-name](./../lib/rules/input-radio-req-name/README.md)                       | Enforce the presence of a none empty `name` attribute on radio input                      |
| [input-req-label](./../lib/rules/input-req-label/README.md)                                 | Enforce the presence of a label for `<input>`                                             |
| [label-no-enc-textarea-or-select](./../lib/rules/label-no-enc-textarea-or-select/README.md) | Disallow the presence of `<select>` and `<textarea>` inside a `<label>`                   |
| [label-req-for](./../lib/rules/label-req-for/README.md)                                     | Enforce the presence of a none empty `name` attribute on `<label>`                        |
| [lang-style](./../lib/rules/lang/README.md#lang-style)                                      |                                                                                           |
| [line-end-style](./../lib/rules/line-end-style/README.md)                                   |                                                                                           |
| [line-max-len](./../lib/rules/line-max-len/README.md)                                       | Limit the length of a line                                                                |
| [line-max-len-ignore-regex](./../lib/rules/line-max-len#line-max-len-ignore-regex)          |                                                                                           |
| [line-no-trailing-whitespace](./../lib/rules/line-no-trailing-whitespace/README.md)         | Disallow trailing whitespace at the end of lines                                          |
| [link-min-length-4](./../lib/rules/link-min-length-4/README.md)                             | Disallow link text with less than 4 chars                                                 |
| [link-req-noopener](./../lib/rules/link-req-noopener/README.md)                             | Enforce the presence of `rel="noopener"` or `rel="noreferrer"` attribute on `<a>`         |
| [spec-char-escape](./../lib/rules/spec-char-escape/README.md)                               |                                                                                           |
| [table-req-caption](./../lib/rules/table-req-caption/README.md)                             | Enforce the presence of `<caption>` inside `<table>`                                      |
| [table-req-header](./../lib/rules/table-req-header/README.md)                               | Enforce the presence of `<thead>` inside `<table>`                                        |
| [tag-bans](./../lib/rules/tag-bans/README.md)                                               | Define a list of HTML tags that are forbidden                                             |
| [tag-close](./../lib/rules/tag-close/README.md)                                             |                                                                                           |
| [tag-name-lowercase](./../lib/rules/tag-name-lowercase/README.md)                           | Enforce the use of lowercase for tag name                                                 |
| [tag-name-match](./../lib/rules/tag-close/README.md#tag-name-match)                         |                                                                                           |
| [tag-req-attr](./../lib/rules/tag-req-attr/README.md)                                       | Define a list of attributes that must be present on an HTML tag                           |
| [tag-self-close](./../lib/rules/tag-close/README.md#tag-self-close)                         | Define whether or not a self-close tag should end with `/>`                               |
| [text-ignore-regex](./../lib/rules/spec-char-escape/README.md#text-ignore-regex)            |                                                                                           |
| [title-max-len](./../lib/rules/title-max-len/README.md)                                     | Fix a maximum lenght an the `<title>` content                                             |
| [title-no-dup](./../lib/rules/title-no-dup/README.md)                                       | Disallow the presence of multiple `<title>`                                               |

<!-- ## Other rules (not real rules yet) -->
<!-- * [maxerr](./../lib/rules/maxerr/README.md) //not-found, not a rule -->
<!-- * [raw-ignore-regex](./../lib/rules/raw-ignore-regex/README.md) //not-found  -->
