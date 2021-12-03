// Keep as nodejs syntaxt for now
module.exports = {
  is_labelable: require("./is_labelable").default,
  is_void_node: require("./is_void_node").default,
  check_lang_attribute: require("./check_lang_attribute").default,
  ...require("./attr_parse"),
  ...require("./boolean_attrs"),
  ...require("./tags")
};
