module.exports = {
  "spec-char-escape": false,
  "attr-name-ignore-regex": /^[0-9a-o]+$/,
  rules: {
    "attr-bans": [
      true,
      [
        "align",
        "background",
        "bgcolor",
        "border",
        "frameborder",
        "longdesc",
        "marginwidth",
        "marginheight",
        "scrolling",
        "style",
        "width"
      ]
    ],
    "attr-name-style": [
      true,
      "dash"
    ],
    "attr-new-line": [
      true,
      1
    ],
    "attr-no-dup": true,
    "attr-no-unsafe-char": true,
    "attr-order": [
      true,
      [
        "id",
        "class"
      ]
    ],
    "attr-quote-style": [
      true,
      "double"
    ],
    "attr-req-value": true,
    "attr-validate": true,

    "class-no-dup": true,
    "class-style": [
      true,
      "lowercase"
    ],

    "doctype-html5": true,
    "doctype-first": true,

    "head-valid-content-model": true,
    "head-req-title": true,
    "html-req-lang": true,
    "html-valid-content-model": true,
    "href-style": [
      true,
      "relative"
    ],

    "id-class-no-ad": true,
    "id-class-style": [
      true,
      "underscore"
    ],
    "id-no-dup": true,
    "id-style": [
      true,
      "underscore"
    ],
    "img-req-alt": true,
    "img-req-src": true,
    "indent-delta": true,
    "indent-style": [
      true,
      "tabs"
    ],
    "indent-width": [
      true,
      4
    ],
    "indent-width-cont": true,

    "label-req-for": true,
    "lang-style": [
      true,
      "case"
    ],
    "line-end-style": [
      true,
      "lf"
    ],
    "line-no-trailing-whitespace": true,
    "line-max-len": [
      true,
      80
    ],
    "link-req-noopener": true,

    "tag-bans": [
      true,
      [
        "style",
        "b",
        "i"
      ]
    ],
    "tag-close": true,
    "tag-name-lowercase": true,
    "tag-name-match": true,
    "tag-self-close": true,
    "title-no-dup": true,
    "title-max-len": [
      true,
      60
    ],
    "fig-req-figcaption": false,
    "focusable-tabindex-style": false,
    "input-radio-req-name": true,
    "input-req-label": false,
    "table-req-caption": false,
    "table-req-header": false,
    "tag-req-attr": false
  }
};
