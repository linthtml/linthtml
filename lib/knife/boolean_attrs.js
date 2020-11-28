/* eslint-disable array-element-newline */
const BOOLEAN_ATTRIBUTES = [
  "allowfullscreen", "async", "autofocus",
  "autoplay", "checked", "compact", "controls",
  "declare", "default", "defaultchecked",
  "defaultmuted", "defaultselected", "defer",
  "disabled", "draggable", "enabled",
  "formnovalidate", "hidden", "indeterminate",
  "inert", "ismap", "itemscope", "loop",
  "multiple", "muted", "nohref", "noresize",
  "noshade", "novalidate", "nowrap", "open",
  "pauseonexit", "readonly", "required",
  "reversed", "scoped", "seamless", "selected",
  "sortable", "spellcheck", "translate",
  "truespeed", "typemustmatch", "visible"
];

function is_boolean_attribute(name) {
  return BOOLEAN_ATTRIBUTES.indexOf(name.toLowerCase()) >= 0;
}

module.exports = {
  is_boolean_attribute,
  BOOLEAN_ATTRIBUTES
};
