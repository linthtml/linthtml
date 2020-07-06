module.exports = {
  applyRules: require("./apply_rules"),
  is_labelable: require("./is_labelable"),
  isVoidElement: require("./is_void_element"),
  check_lang_attribute: require("./check_lang_attribute"),
  ...require("./attr_parse"),
  ...require("./boolean_attrs"),
  ...require("./tag_utils")
};
