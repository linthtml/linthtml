"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.has_parent_node = exports.node_tag_name = exports.get_classes = exports.attribute_has_value = exports.has_attribute = exports.get_attribute = exports.is_self_closing = exports.is_text_node = exports.is_tag_node = exports.attribute_value = exports.has_non_empty_attribute = void 0;
const domelementtype_1 = require("domelementtype");
const util_1 = require("util");
const { isRegExp } = util_1.types;
function is_self_closing(node) {
    const openRaw = node.open.raw; // Force raw presence for Element?
    return /\/>$/.test(openRaw);
}
exports.is_self_closing = is_self_closing;
function has_attribute(node, attribute_name) {
    return is_tag_node(node)
        ? node.attributes.some(({ name }) => name.chars.toLowerCase() === attribute_name)
        : false;
}
exports.has_attribute = has_attribute;
/**
 * Check whether the given tag has a non-empty attribute with the given
 * name. Count "" as a non-empty attribute value only if optional
 * parameter allow_null is true
 */
function has_non_empty_attribute(node, attribute_name, allow_null = false) {
    const attribute = node.attributes.find(({ name }) => name.chars.toLowerCase() === attribute_name);
    return !!attribute && (allow_null || !!attribute.value && attribute.value.chars.length > 0);
}
exports.has_non_empty_attribute = has_non_empty_attribute;
function get_attribute(node, attribute_name) {
    if (has_attribute(node, attribute_name)) {
        return node.attributes
            .find(({ name }) => name.chars.toLowerCase() === attribute_name);
    }
    return null;
}
exports.get_attribute = get_attribute;
function attribute_value(node, attribute_name) {
    var _a;
    const attribute = get_attribute(node, attribute_name);
    return (_a = attribute === null || attribute === void 0 ? void 0 : attribute.value) !== null && _a !== void 0 ? _a : null;
}
exports.attribute_value = attribute_value;
function attribute_has_value(node, attribute_name, value_to_check) {
    const value = attribute_value(node, attribute_name);
    if (value) {
        return isRegExp(value_to_check)
            ? value_to_check.test(value.chars)
            : value.chars === value_to_check;
    }
    return false;
}
exports.attribute_has_value = attribute_has_value;
function is_tag_node(node) {
    return [
        domelementtype_1.ElementType.Tag,
        domelementtype_1.ElementType.Style,
        domelementtype_1.ElementType.Script
    ].indexOf(node.type) !== -1;
}
exports.is_tag_node = is_tag_node;
// Todo check is current node text have `.loc` property if yes then create class Text_Node in dom_element.ts
// @ts-ignore
function is_text_node(node) {
    return node.type === domelementtype_1.ElementType.Text;
}
exports.is_text_node = is_text_node;
function get_classes(class_attribute) {
    var _a;
    const classes = (_a = class_attribute === null || class_attribute === void 0 ? void 0 : class_attribute.chars) !== null && _a !== void 0 ? _a : "";
    return classes
        .trim()
        .split(/\s+/);
}
exports.get_classes = get_classes;
function node_tag_name(node) {
    switch (node.type) {
        case domelementtype_1.ElementType.Text:
            return "Text Node"; // get text node content but truncate ?
        case domelementtype_1.ElementType.Comment:
            return "Comment";
        default:
            // TODO: Check function with other types (CDATA, doctype...)
            return node.name;
    }
}
exports.node_tag_name = node_tag_name;
function has_parent_node(node) {
    // root node is not a "normal" node
    return !!node.parent && node.parent.type !== "root";
}
exports.has_parent_node = has_parent_node;
