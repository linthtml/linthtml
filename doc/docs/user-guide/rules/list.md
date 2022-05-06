# List of rules

The following table contains the list of all rules available in Link HTML.
To learn more about how activate or configure rules, have a look to this [documentation page](../configuration.md).

| Rule name                                                                            | Description                                                                       |
| :------------------------------------------------------------------------------------| :-------------------------------------------------------------------------        |
| [attr-bans](./list/attr-bans.md)                                             | Specify a list of disallowed HTML attributes                                      |
| [attr-name-style](./list/attr-name-style.md)                                 | Enforce naming conventions for HTML tag name                                      |
| [attr-name-ignore-regex](./list/attr-name-ignore-regex.md)                   |                                                                                   |
| [attr-new-line](./list/attr-new-line.md)                                     | Specify the numbers of HTML attributes allowed on one line                        |
| [attr-no-dup](./list/attr-no-dup.md)                                         | Disallow duplications of HTML attributes within the same tag                      |
| [attr-no-unsafe-char](./list/attr-no-unsafe-char.md)                         | Disallow the use of unsafe unicode char in attributes values                      |
| [attr-order](./list/attr-order.md)                                           | Specify the order of attributes in an HTML tag.                                   |
| [attr-quote-style](./list/attr-quote-style.md)                               | Enforce the consistent use of quotes.                                             |
| [attr-req-value](./list/attr-req-value.md)                                   | Enforce the presence of a value for an HTML attribute                             |
| [attr-validate](./list/attr-validate.md)                                     | Validate that attributes are correctly written                                    |
| [button-req-content](./list/button-req-content.md)                           | Enforce the presence of a text content for a button                               |
| [class-no-dup](./list/class-no-dup.md)                                       | Disallow the presence of the same className within the `class` attribute          |
| [class-style](./list/class-style.md)                                         | Enforce naming convention for CSS classes                                         |
| [doctype-first](./list/doctype-first.md)                                     | Enforce the presence of `<!DOCTYPE ...>` on top of an HTML document               |
| [doctype-html5](./list/doctype-html5.md)                                     | Enforce the use of the HTML5 doctype                                              |
| [fieldset-contains-legend](./list/fieldset-contains-legend.md)               | Every `fieldset` element should contain a `legend` element                        |
| [fig-req-figcaption](./list/fig-req-figcaption.md)                           | Enforce the presence of the tag `<figcaption>` inside a `<figure>` tag.           |
| [focusable-tabindex-style](./list/focusable-tabindex-style.md)               | Disallow the use of positive tabindex (>1)                                        |
| [head-req-title](./list/head-req-title.md)                                   | Enforce the presence of a `<title>` inside `<head>`                               |
| [head-valid-content-model](./list/head-valid-content-model.md)               |                                                                                   |
| [href-style](./list/href-style.md)                                           | `href` must be set with absolute or relative links.                               |
| [html-req-lang](./list/html-req-lang.md)                                     | Enforce the presence of the `lang` attribute on any `<html>` tag                  |
| [html-valid-content-model](./list/html-valid-content-model.md)               |                                                                                   |
| [id-class-ignore-regex](./list/id-class-ignore-regex.md)                     |                                                                                   |
| [id-class-no-ad](./list/id-class-no-ad.md)                                   |                                                                                   |
| [id-class-style](./list/id-class-style.md)                                   | Enforce naming convention for HTML ids and CSS classes                            |
| [id-no-dup](./list/id-no-dup.md)                                             | Disallow duplications of HTML ids within the same document                        |
| [id-style](./list/id-style.md)                                               | Enforce naming convention for HTML ids                                            |
| [img-req-alt](./list/img-req-alt.md)                                         | Enforce the presence of a none empty `alt` attribute on `<img>`                   |
| [img-req-src](./list/img-req-src.md)                                         | Enforce the presence of a none empty `src` attribute on `<img>`                   |
| [indent-delta](./list/indent-delta.md) _deprecated_                          |                                                                                   |
| [indent-style](./list/indent-style.md)                                       | Specify indentation style (`tab` or `space`)                                      |
| [indent-width](./list/indent-width.md)                                       | Specify indentation width                                                         |
| [indent-width-cont](./list/indent-width-cont.md) _deprecated_                |                                                                                   |
| [input-btn-req-value-or-title](./list/input-btn-req-value-or-title.md)       | Enforce the presence of a label for `<button>`                                    |
| [input-radio-req-name](./list/input-radio-req-name.md)                       | Enforce the presence of a none empty `name` attribute on radio input              |
| [input-req-label](./list/input-req-label.md)                                 | Enforce the presence of a label for `<input>`                                     |
| [label-no-enc-textarea-or-select](./list/label-no-enc-textarea-or-select.md) | Disallow the presence of `<select>` and `<textarea>` inside a `<label>`           |
| [label-req-for](./list/label-req-for.md)                                     | Enforce the presence of a none empty `name` attribute on `<label>`                |
| [lang-style](./list/lang-style.md)                                           |                                                                                   |
| [line-end-style](./list/line-end-style.md)                                   |                                                                                   |
| [line-max-len](./list/line-max-len.md)                                       | Limit the length of a line                                                        |
| [line-max-len-ignore-regex](./list/line-max-len-ignore-regex.md)             |                                                                                   |
| [line-no-trailing-whitespace](./list/line-no-trailing-whitespace.md)         | Disallow trailing whitespace at the end of lines                                  |
| [link-min-length-4](./list/link-min-length-4.md)                             | Disallow link text with less than 4 chars                                         |
| [link-req-noopener](./list/link-req-noopener.md)                             | Enforce the presence of `rel="noopener"` or `rel="noreferrer"` attribute on `<a>` |
| [spec-char-escape](./list/spec-char-escape.md)                               |                                                                                   |
| [table-req-caption](./list/table-req-caption.md)                             | Enforce the presence of `<caption>` inside `<table>`                              |
| [table-req-header](./list/table-req-header.md)                               | Enforce the presence of `<thead>` inside `<table>`                                |
| [tag-bans](./list/tag-bans.md)                                               | Define a list of HTML tags that are forbidden                                     |
| [tag-close](./list/tag-close.md)                                             |                                                                                   |
| [tag-name-lowercase](./list/tag-name-lowercase.md)                           | Enforce the use of lowercase for tag name                                         |
| [tag-name-match](./list/tag-name-match.md)                                   |                                                                                   |
| [tag-req-attr](./list/tag-req-attr.md)                                       | Define a list of attributes that must be present on an HTML tag                   |
| [tag-self-close](./list/tag-self-close.md)                                   | Define whether or not a self-close tag should end with `/>`                       |
| [text-ignore-regex](./list/text-ignore-regex.md)                             |                                                                                   |
| [title-max-len](./list/title-max-len.md)                                     | Fix a maximum lenght an the `<title>` content                                     |
| [title-no-dup](./list/title-no-dup.md)                                       | Disallow the presence of multiple `<title>`                                       |
