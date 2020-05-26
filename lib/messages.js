module.exports.CLI_ERRORS = {
  "01": (chalk, meta) => chalk`{red Error:} Cannot find a config file in the directory {underline ${meta.config_path}}`,
  "02": (chalk, meta) => chalk`{red Error:} Cannot find the config file {underline ${meta.config_path}}`
};

// TODO: add the possibility to use chalk ?
const errors = {
  E000: (/* data */) => "not a valid error code",
  E001: (data) => `The attribute "${data.attribute}" attribute is banned`,
  E002: (data) => `Attribute names must match the format: ${data.format}`,
  E003: (data) => `The attribute ${data.attribute} is duplicated`,
  E004: (/* data */) => "attribute values must not include unsafe characters",
  E005: (data) => `The attribute "${data.attribute}"  is not ${data.format}`,
  E006: (/* data */) => "attribute values cannot be empty",
  E007: (/* data */) => "<!DOCTYPE> should be the first element seen",
  E008: (/* data */) => "The doctype must conform to the HTML5 standard",
  E009: (data) => `Use only ${data.format} links`,
  E010: (data) => `ids and classes may not use the word: ${data.word}`,
  E011: (data) => `Value "${data.value}" of attribute "${data.attribute}" does not respect the format: ${data.format}`,
  E012: (data) => `the id "${data.id}" is already in use`,
  E013: (/* data */) => "the `alt` property must be set for image tags",
  E014: (/* data */) => "a source must be given for each `img` tag",
  E015: (data) => `line ending does not match format: ${data.format}`,
  E016: (data) => `the ${data.tag} tag is banned`,
  E017: (/* data */) => "tag names must be lowercase",
  E018: (data) => `void element should ${data.expect} close itself`,
  E019: (/* data */) => "all labels should have a \"for\" attribute",
  E020: (/* data */) => "label does not have a \"for\" attribute or a labeable child",
  E021: (data) => `An element with the id "${data.id}" does not exist (should match a "for" attribute)`,
  E022: (data) => `The linked element is not labeable (id: ${data.id})`,
  E023: (data) => `${data.part} contains ${data.desc}: ${data.chars}`,
  E024: (data, position) => {
    return `Incorrect indentation for \`${data.tagName}\` beginning at L${position.line}:C${position.column}. Expected indentation of ${data.expected_indentation} ${data.expected_type} but found ${data.current_indentation} ${data.current_type}.`;
  },
  E025: (/* data */) => "HTML element should specify the language of the page",
  E026: (data) => `${data.op} (all focusable elements on a page must either have a negative or 0 tabindex or none at all)`,
  E027: (/* data */) => "The <head> tag must contain a title",
  E028: (data) => `The <head> tag can only contain one title: ${data.num} given`,
  E029: (data) => `Title "${data.title}" exceeds maximum length of ${data.maxlength}`,
  E030: (/* data */) => "Tag start and end must match",
  E031: (/* data */) => "Table must have a caption for accessibility",
  E032: (/* data */) => "Figure must have a figcaption, figcaption must be in a figure (for accessibility)",
  E033: (data) => `Input with id: ${data.idValue} is not associated with a label for accessibility`,
  E034: (/* data */) => "Radio input must have an associated name",
  E035: (/* data */) => "Table must have a header for accessibility",
  E036: (data, position) => {
    const tag = data.isClose ? `<\\${data.tagName}>` : `<${data.tagName}>`;
    return `Incorrect indentation for \`${data.tagName}\` beginning at L${position.line}:C${position.column}. Expected \`${tag}\` to be at an indentation of ${data.expected_indentation} but was found at ${data.current_indentation}.`;
  },
  E037: (data) => `Only ${data.limit} attributes per line are permitted`,
  E038: (data) => `"lang" attribute ${data.lang} is not valid`,
  E039: (data) => `"lang" attribute ${data.lang} in not properly capitalized`,
  E040: (data) => `Line length should not exceed ${data.maxlength} characters (current: ${data.length})`,
  E041: (data) => `Duplicate class: ${data.classes}`,
  E042: (/* data */) => "Tag is not closed",
  E043: (data) => `Attribute "${data.attribute}" should come before "${data.previous}"`,
  E044: (/* data */) => "Only <head> and <body> may be children of <html>",
  E045: (/* data */) => "Tags in <html> may not be duplicated",
  E046: (/* data */) => "<head> tag must come before <body> in <html>",
  E047: (/* data */) => "The only tags allowed in the <head> are base, link, meta, noscript, script, style, template, and title",
  E049: (/* data */) => "tag attributes are malformed",
  E051: ({ name }) => `unrecognized rule name or preset \`${name}\` in linthtml-configure instruction`,
  E052: ({ preset }) => `unrecognized preset name \`${preset}\` in linthtml-configure instruction `,
  E055: (/* data */) => "Line contains trailing whitespace",
  E056: (data) => `Expected from ${data.expectedMin} to ${data.expectedMax} levels of indentation. ${data.value} levels instead`,
  E057: (data) => `Mandatory attribute "${data.attribute}" is missing in tag "${data.tag}"`,
  E058: (/* data */) => "rel=\"noopener\" required for links with target=\"blank\"",
  E059: (data) => `WCAG rule 38: links should have at least 4 chars "${data.content}" is of length ${data.content.length}`,
  E060: (/* data */) => "WCAG rule 77: Input elements where type=[button|submit|reset] must have a value or title attribute.",
  E061: (/* data */) => "WCAG rule 78: Each button element must contain content.",
  E062: (/* data */) => "WCAG rule 74: The label element should not encapsulate select and textarea elements.",
  E063: (/* data */) => "WCAG rule 73: Each fieldset element should contain a legend element.",

  INLINE_01: ({ instruction }) => `unrecognized linthtml instruction: \`linthtml-${instruction}\``,
  INLINE_02: ({ rule_name }) => `unrecognized rule name \`${rule_name}\` in linthtml-configure instruction`,
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
  return format(issue.data, { line: issue.line, column: issue.column });
};

module.exports.get_issue_message = function(issue) {
  const generate_issue_message = errors[issue.code];
  return generate_issue_message(issue.data, issue.position);
};
