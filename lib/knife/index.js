module.exports = {
  is_labelable: require("./is_labelable"),
  is_void_node: require("./is_void_node"),
  check_lang_attribute: require("./check_lang_attribute"),
  ...require("./attr_parse"),
  ...require("./boolean_attrs"),
  ...require("./tag_utils")
};
