# List of rules

The following table contains the list of all rules available in Link HTML.
To learn more about how activate or configure rules, have a look to this [documentation page](../configuration.md).

| Rule name                                                                            | Description                                                                       |
| :------------------------------------------------------------------------------------| :-------------------------------------------------------------------------        |
| [attr-bans](./rules/attr-bans.md)                                             | Specify a list of disallowed HTML attributes                                      |
| [attr-name-style](./rules/attr-name-style.md)                                 | Enforce naming conventions for HTML tag name                                      |
| [attr-name-ignore-regex](./rules/attr-name-ignore-regex.md)                   |                                                                                   |
| [attr-new-line](./rules/attr-new-line.md)                                     | Specify the numbers of HTML attributes allowed on one line                        |
| [attr-no-dup](./rules/attr-no-dup.md)                                         | Disallow duplications of HTML attributes within the same tag                      |
| [attr-no-unsafe-char](./rules/attr-no-unsafe-char.md)                         | Disallow the use of unsafe unicode char in attributes values                      |
| [attr-order](./rules/attr-order.md)                                           | Specify the order of attributes in an HTML tag.                                   |
| [attr-quote-style](./rules/attr-quote-style.md)                               | Enforce the consistent use of quotes.                                             |
| [attr-req-value](./rules/attr-req-value.md)                                   | Enforce the presence of a value for an HTML attribute                             |
| [attr-validate](./rules/attr-validate.md)                                     | Validate that attributes are correctly written                                    |
| [button-req-content](./rules/button-req-content.md)                           | Enforce the presence of a text content for a button                               |
| [class-no-dup](./rules/class-no-dup.md)                                       | Disallow the presence of the same className within the `class` attribute          |
| [class-style](./rules/class-style.md)                                         | Enforce naming convention for CSS classes                                         |
| [doctype-first](./rules/doctype-first.md)                                     | Enforce the presence of `<!DOCTYPE ...>` on top of an HTML document               |
| [doctype-html5](./rules/doctype-html5.md)                                     | Enforce the use of the HTML5 doctype                                              |
| [fieldset-contains-legend](./rules/fieldset-contains-legend.md)               | Every `fieldset` element should contain a `legend` element                        |
| [fig-req-figcaption](./rules/fig-req-figcaption.md)                           | Enforce the presence of the tag `<figcaption>` inside a `<figure>` tag.           |
| [focusable-tabindex-style](./rules/focusable-tabindex-style.md)               | Disallow the use of positive tabindex (>1)                                        |
| [head-req-title](./rules/head-req-title.md)                                   | Enforce the presence of a `<title>` inside `<head>`                               |
| [head-valid-content-model](./rules/head-valid-content-model.md)               |                                                                                   |
| [href-style](./rules/href-style.md)                                           | `href` must be set with absolute or relative links.                               |
| [html-req-lang](./rules/html-req-lang.md)                                     | Enforce the presence of the `lang` attribute on any `<html>` tag                  |
| [html-valid-content-model](./rules/html-valid-content-model.md)               |                                                                                   |
| [id-class-ignore-regex](./rules/id-class-ignore-regex.md)                     |                                                                                   |
| [id-class-no-ad](./rules/id-class-no-ad.md)                                   |                                                                                   |
| [id-class-style](./rules/id-class-style.md)                                   | Enforce naming convention for HTML ids and CSS classes                            |
| [id-no-dup](./rules/id-no-dup.md)                                             | Disallow duplications of HTML ids within the same document                        |
| [id-style](./rules/id-style.md)                                               | Enforce naming convention for HTML ids                                            |
| [img-req-alt](./rules/img-req-alt.md)                                         | Enforce the presence of a none empty `alt` attribute on `<img>`                   |
| [img-req-src](./rules/img-req-src.md)                                         | Enforce the presence of a none empty `src` attribute on `<img>`                   |
| [indent-delta](./rules/indent-delta.md) _deprecated_                          |                                                                                   |
| [indent-style](./rules/indent-style.md)                                       | Specify indentation style (`tab` or `space`)                                      |
| [indent-width](./rules/indent-width.md)                                       | Specify indentation width                                                         |
| [indent-width-cont](./rules/indent-width-cont.md) _deprecated_                |                                                                                   |
| [input-btn-req-value-or-title](./rules/input-btn-req-value-or-title.md)       | Enforce the presence of a label for `<button>`                                    |
| [input-radio-req-name](./rules/input-radio-req-name.md)                       | Enforce the presence of a none empty `name` attribute on radio input              |
| [input-req-label](./rules/input-req-label.md)                                 | Enforce the presence of a label for `<input>`                                     |
| [label-no-enc-textarea-or-select](./rules/label-no-enc-textarea-or-select.md) | Disallow the presence of `<select>` and `<textarea>` inside a `<label>`           |
| [label-req-for](./rules/label-req-for.md)                                     | Enforce the presence of a none empty `name` attribute on `<label>`                |
| [lang-style](./rules/lang-style.md)                                           |                                                                                   |
| [line-end-style](./rules/line-end-style.md)                                   |                                                                                   |
| [line-max-len](./rules/line-max-len.md)                                       | Limit the length of a line                                                        |
| [line-max-len-ignore-regex](./rules/line-max-len-ignore-regex.md)             |                                                                                   |
| [line-no-trailing-whitespace](./rules/line-no-trailing-whitespace.md)         | Disallow trailing whitespace at the end of lines                                  |
| [link-min-length-4](./rules/link-min-length-4.md)                             | Disallow link text with less than 4 chars                                         |
| [link-req-noopener](./rules/link-req-noopener.md)                             | Enforce the presence of `rel="noopener"` or `rel="noreferrer"` attribute on `<a>` |
| [spec-char-escape](./rules/spec-char-escape.md)                               |                                                                                   |
| [table-req-caption](./rules/table-req-caption.md)                             | Enforce the presence of `<caption>` inside `<table>`                              |
| [table-req-header](./rules/table-req-header.md)                               | Enforce the presence of `<thead>` inside `<table>`                                |
| [tag-bans](./rules/tag-bans.md)                                               | Define a list of HTML tags that are forbidden                                     |
| [tag-close](./rules/tag-close.md)                                             |                                                                                   |
| [tag-name-lowercase](./rules/tag-name-lowercase.md)                           | Enforce the use of lowercase for tag name                                         |
| [tag-name-match](./rules/tag-name-match.md)                                   |                                                                                   |
| [tag-req-attr](./rules/tag-req-attr.md)                                       | Define a list of attributes that must be present on an HTML tag                   |
| [tag-self-close](./rules/tag-self-close.md)                                   | Define whether or not a self-close tag should end with `/>`                       |
| [text-ignore-regex](./rules/text-ignore-regex.md)                             |                                                                                   |
| [title-max-len](./rules/title-max-len.md)                                     | Fix a maximum lenght an the `<title>` content                                     |
| [title-no-dup](./rules/title-no-dup.md)                                       | Disallow the presence of multiple `<title>`                                       |
