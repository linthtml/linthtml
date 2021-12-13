module.exports.CORE_ERRORS = {
  "01": (chalk, meta) => chalk`{red Error:} Cannot find a config file in the directory {underline ${meta.config_path}}`,
  "02": (chalk, meta) => chalk`{red Error:} Cannot find the config file {underline ${meta.config_path}}`,
  "03": (chalk, meta) => chalk`{red Error:} Cannot find module "${meta.module_name}" to extends`,
  "04": (chalk, meta) => chalk`{red Error:} Failed to load parser "${meta.module_name}". Cannot find module "${meta.module_name}"`,
  "05": (chalk, meta) => chalk`{red Error:} Cannot find plugin "${meta.module_name}", make sure it's installed locally.`,
  "06": (chalk, meta) => chalk`{red Error:} Plugins should expose rules having a property "name". The plugin "${meta.plugin_name}" is not doing this, so it will not work. Please file an issue with the plugin.`,
  "07": (chalk, meta) => chalk`{red Error:} Plugin rules have to be namespaced, i.e. only "plugin-namespace/plugin-rule-name" plugin rule names are supported. The plugin rule "${meta.rule_name}" from plugin "${meta.plugin_name}" does not do this, so will not work. Please file an issue with the plugin.`,
  "08": (chalk, meta) => chalk`{red Error:} Plugin rules need to define a "lint" function. The plugin rule "${meta.rule_name}" from plugin "${meta.plugin_name}" does not do this, so will not work. Please file an issue with the plugin.`,
  "09": (chalk, meta) => chalk`{red Error:} Plugins should expose rules under the property "rules" and as an array.`
};

// TODO: add the possibility to use chalk ?
const errors = {
  E000: (/* data */) => "not a valid error code",
  E001: (data) => `The attribute "${data.attribute}" attribute is cannot be used as it's banned`,
  E002: ({ format, attribute }) => `The attribute "${attribute}" must be written using the format "${format}"`,
  E003: (data) => `The attribute ${data.attribute} is duplicated`,
  E004: ({ attribute }) => `The value of the attribute "${attribute}" contains unsafe characters`,
  E005: (data) => `The attribute "${data.attribute}" is not ${data.format}`,
  E006: ({ attribute }) => `The attribute "${attribute}" requires a value`,
  E007: (/* data */) => "The first element of the document should be <!DOCTYPE>",
  E008: (/* data */) => "The doctype must conform to the HTML5 standard",
  E009: (data) => `Invalid href for link, only ${data.format} links are allowed`,
  E010: ({ attribute, word }) => `The value of attribute "${attribute}" contains the word "${word}" which is not allowed`,
  E011: (data) => `The value "${data.value}" of attribute "${data.attribute}" does not respect the format: ${data.format}`,
  E012: (data) => `The id "${data.id}" is already used at L${data.line}:c${data.column}`,
  E013: (/* data */) => "The \"alt\" attribute must be set for <img> tag",
  E014: (/* data */) => "The \"src\" attribute must be set for each <img> tag",
  E015: (data) => `Line ending does not match format: ${data.format}`,
  E016: (data) => `The tag <${data.tag}> is banned and should not be used`,
  E017: (data) => `Invalid case for tag <${data.name}>, tag names must be written in lowercase`,
  E018: (data) => `Void element should ${data.expect} close itself`,
  E019: (/* data */) => "The label has no attribute \"for\"",
  E020: (/* data */) => "The Label does not have a \"for\" attribute or a labeable child",
  E021: (data) => `There's no element with an id matching the one provided to the "for" attribute. Provided id is "${data.id}"`,
  E022: (data) => `The element with the id "${data.id}" is not labeable`,
  E023: (data) => `${data.part} contains ${data.desc}: ${data.chars}`,
  E024: (data, { start }) => {
    return `Incorrect indentation for \`${data.tagName}\` beginning at L${start.line}:C${start.column}. Expected indentation of ${data.expected_indentation} ${data.expected_type} but found ${data.current_indentation} ${data.current_type}.`;
  },
  E025: (/* data */) => "<HTML> tag should specify the language of the page using the \"lang\" attribute",
  E026: (data) => `The element has a tabindex of ${data.tabindex}, all focusable elements on a page must either have a negative number or 0 as tabindex`,
  E027: (/* data */) => "The <head> tag must contain a title",
  E028: (data) => `The <head> tag can only contain one title: ${data.num} given`,
  E029: (data) => `Title "${data.title}" exceeds maximum length of ${data.maxlength}`,
  E030: ({ open }) => `Tag close does not match opened tag at C${open.loc.start.line}:L${open.loc.start.column}`,
  E031: (/* data */) => "Table must have captions (<caption>) for accessibility",
  E032: (/* data */) => "Tag <figure> must contains a <figcaption> tag for accessibility",
  E033: (data) => `Input with id "${data.idValue}" has no associated label`,
  E034: (/* data */) => "Radio input must have an associated name",
  E035: (/* data */) => "Table must contains a header (<thead>) for accessibility",
  E036: (data, { start }) => {
    const tag = data.isClose ? `<\\${data.tagName}>` : `<${data.tagName}>`;
    return `Incorrect indentation for \`${data.tagName}\` beginning at L${start.line}:C${start.column}. Expected \`${tag}\` to be at an indentation of ${data.expected_indentation} but was found at ${data.current_indentation}.`;
  },
  E037: (data) => `Only ${data.limit} attributes per line are permitted`,
  E038: (data) => `Value "${data.lang}" for attribute "lang" is not valid`,
  E039: (data) => `Value "${data.lang}" for attribute "lang" is not properly capitalized`,
  E040: (data) => `This line has a length of ${data.length}. Maximum allowed is ${data.maxlength}`,
  E041: (data) => `The "class" attribute already contains "${data.classes}"`,
  E042: (/* data */) => "Tag is not closed",
  E043: (data) => `Attribute "${data.attribute}" should come before "${data.previous}"`,
  E044: (/* data */) => "Only <head> and <body> may be children of <html>",
  E045: (/* data */) => "Tags in <html> may not be duplicated",
  E046: (/* data */) => "Tag <head> must come before <body> in <html>",
  E047: (/* data */) => "The only tags allowed in the <head> are base, link, meta, noscript, script, style, template, and title",
  E049: (/* data */) => "The tag attributes are malformed",
  E051: ({ name }) => `unrecognized rule name or preset \`${name}\` in linthtml-configure instruction`,
  E052: ({ preset }) => `unrecognized preset name \`${preset}\` in linthtml-configure instruction `,
  E055: (/* data */) => "Line contains trailing whitespace",
  E056: (data) => `Expected from ${data.expectedMin} to ${data.expectedMax} levels of indentation. ${data.value} levels instead`,
  E057: (data) => `Mandatory attribute "${data.attribute}" is missing in tag <${data.tag}>`,
  E058: (/* data */) => "Links should with `target=\"blank\"` should define `rel=\"noopener\"`",
  E059: (data) => `Link text should have at least 4 chars, current text "${data.content}" has a length of ${data.content.length}`,
  E060: (/* data */) => "Input elements with type \"button\", \"submit\" and \"reset\" must have a value or title attribute.",
  E061: (/* data */) => "Each button element must have a text content.",
  E062: (/* data */) => "A <label> element should not encapsulate select and textarea elements.",
  E063: (/* data */) => "Each fieldset element should contain a legend element.",
  E064: (data) => `Unexpected space ${data.is_before ? "before" : "after"} text.`,

  INLINE_01: ({ instruction }) => `unrecognized linthtml instruction: \`linthtml-${instruction}\``,
  INLINE_02: ({ rule_name }) => `unrecognized rule name \`${rule_name}\` in inline configuration`,
  INLINE_03: ({ rule_configuration }) => `malformed linthtml-configure instruction: \`${rule_configuration}\` is not valid JSON  global`,
  INLINE_04: ({ rule_name, error }) => `linthtml-configure instruction for rule \`${rule_name}\` is not valid. ${error}`
};

// Error code INLINE-xx
// module.exports.INLINE_ERRORS = {
//   "01": ({ instruction }) => `unrecognized linthtml instruction: \`linthtml-${instruction}\``
// };

module.exports.errors = errors;

module.exports.renderMsg = function(code, data) {
  const format = errors[code];
  return format(data);
};

module.exports.renderIssue = function(issue) {
  const format = errors[issue.code];

  return format
    ? format(issue.data, issue.position)
    : issue.message;
};

module.exports.get_issue_message = function(issue) {
  const generate_issue_message = errors[issue.code];
  return generate_issue_message(issue.data, issue.position);
};
