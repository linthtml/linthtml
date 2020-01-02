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
  E024: (data) => `${data.type} not allowed`,
  E025: (/* data */) => "HTML element should specify the language of the page",
  E026: (data) => `${data.op} (all focusable elements on a page must either have a positive tabindex or none at all)`,
  E027: (/* data */) => "The <head> tag must contain a title",
  E028: (data) => `The <head> tag can only contain one title: ${data.num} given`,
  E029: (data) => `Title "${data.title}" exceeds maximum length of ${data.maxlength}`,
  E030: (/* data */) => "Tag start and end must match",
  E031: (/* data */) => "Table must have a caption for accessibility",
  E032: (/* data */) => "Figure must have a figcaption, figcaption must be in a figure (for accessibility)",
  E033: (data) => `Input with id: ${data.idValue} is not associated with a label for accessibility`,
  E034: (/* data */) => "Radio input must have an associated name",
  E035: (/* data */) => "Table must have a header for accessibility",
  E036: (data) => `Wrong indentation, expected indentation of ${data.expected} go ${data.width}`,
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
  E051: (data) => `Invalid option or preset name: ${data.name}`,
  E052: (data) => `Not a preset: ${data.preset}`,
  E054: (data) => `Option ${data.name} does not exist`,
  E055: (/* data */) => "Line contains trailing whitespace",
  E056: (data) => `Expected from ${data.expectedMin} to ${data.expectedMax} levels of indentation. ${data.value} levels instead`,
  E057: (data) => `Mandatory attribute "${data.attribute}" is missing in tag "${data.tag}"`,
  E058: (/* data */) => "rel=\"noopener\" required for links with target=\"blank\"",
  E059: (data) => `WCAG rule 38: links should have at least 4 chars "${data.content}" is of length ${data.content.length}`,
  E060: (/* data */) => "WCAG rule 77: Input elements where type=[button|submit|reset] must have a value or title attribute.",
  E061: (/* data */) => "WCAG rule 78: Each button element must contain content.",
  E062: (/* data */) => "WCAG rule 74: The label element should not encapsulate select and textarea elements.",
  E063: (/* data */) => "WCAG rule 73: Each fieldset element should contain a legend element."
};

module.exports.errors = errors;

module.exports.renderMsg = function(code, data) {
  const format = errors[code];
  return format(data);
};

module.exports.renderIssue = function(issue) {
  return this.renderMsg(issue.code, issue.data);
};
