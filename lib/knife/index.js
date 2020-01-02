module.exports = {
  applyRules: require("./apply_rules"),
  parseHtmlAttrs: require("./attr_parse").parseHtmlAttrs,
  inputIndices: require("./attr_parse").inputIndices,
  booleanAttrs: require("./boolean_attrs").booleanAttrs,
  isBooleanAttr: require("./boolean_attrs").isBooleanAttr,
  isLabeable: require("./is_labeable"),
  isVoidElement: require("./is_void_element"),
  checkLangTag: require("./lang_tag"),
  matchFilter: require("./match_filter"),
  getLineColFunc: require("./relative_line_col"),
  shred: require("./shred"),
  isSelfClosing: require("./tag_utils").isSelfClosing,
  hasNonEmptyAttr: require("./tag_utils").hasNonEmptyAttr,
  attributeValue: require("./tag_utils").attributeValue
};
