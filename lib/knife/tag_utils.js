module.exports.isSelfClosing = function(element) {
  const openRaw = element.open;

  return openRaw[openRaw.length - 1] === "/";
};

// Check whether the given tag has a non-empty attribute with the given
// name. Count "" as a non-empty attribute value only if optional
// parameter allowNull is true,
module.exports.hasNonEmptyAttr = function(tag, name, allowNull) {
  const attribute = tag.attribs[name];
  return !!attribute && (allowNull || (!!attribute.value && attribute.value.length > 0));
};

module.exports.attributeValue = function(tag, attributeName) {
  const attribute = tag.attribs[attributeName];

  return attribute ? attribute.value : "";
};
