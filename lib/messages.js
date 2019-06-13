//TODO: add the possibility to use chalk ?
var errors = {
  E000: () => "not a valid error code",
  E001: () => `The attribute "${arguments[0].attribute}" attribute is banned`,
  E002: () => `Attribute names must match the format: ${arguments[0].format}`,
  E003: () => `The attribute ${arguments[0].attribute} is duplicated`,
  E004: () => "attribute values must not include unsafe characters",
  E005: () => `The attribute "${arguments[0].attribute}"  is not ${arguments[0].format}`,
  E006: () => "attribute values cannot be empty",
  E007: () => "<!DOCTYPE> should be the first element seen",
  E008: () => "The doctype must conform to the HTML5 standard",
  E009: () => `Use only ${arguments[0].format} links`,
  E010: () => "ids and classes may not use the word: ${arguments[0].word}",
  E011: () => `Value "${arguments[0].value}" of attribute "${arguments[0].attribute}" does not respect the format: ${arguments[0].format}`,
  E012: () => `the id "${arguments[0].id}" is already in use`,
  E013: () => "the `alt` property must be set for image tags",
  E014: () => "a source must be given for each `img` tag",
  E015: () => `line ending does not match format: ${arguments[0].format}`,
  E016: () => `the ${arguments[0].tag} tag is banned`,
  E017: () => "tag names must be lowercase",
  E018: () => `void element should ${arguments[0].expect} close itself`,
  E019: () => `all labels should have a "for" attribute`,
  E020: () => `label does not have a "for" attribute or a labeable child`,
  E021: () => `An element with the id "${arguments[0].id}" does not exist (should match a "for" attribute)`,
  E022: () => `The linked element is not labeable (id: ${arguments[0].id})`,
  E023: () => `${arguments[0].part} contains ${arguments[0].desc}: ${arguments[0].chars}`,
  E024: () => `${arguments[0].type} not allowed`,
  E025: () => "HTML element should specify the language of the page",
  E026: () => `${arguments[0].op} (all focusable elements on a page must either have a positive tabindex or none at all)`,
  E027: () => "The <head> tag must contain a title",
  E028: () => `The <head> tag can only contain one title: ${arguments[0].num} given`,
  E029: () => `Title "${arguments[0].title}" exceeds maximum length of ${arguments[0].maxlength}`,
  E030: () => "Tag start and end must match",
  E031: () => "Table must have a caption for accessibility",
  E032: () => "Figure must have a figcaption, figcaption must be in a figure (for accessibility)",
  E033: () => `Input with id: ${arguments[0].idValue} is not associated with a label for accessibility`,
  E034: () => "Radio input must have an associated name",
  E035: () => "Table must have a header for accessibility",
  E036: () => `Wrong indentation, expected indentation of ${arguments[0].expected} go ${arguments[0].width}`,
  E037: () => `Only ${arguments[0].limit} attributes per line are permitted`,
  E038: () => `"lang" attribute ${arguments[0].lang} is not valid`,
  E039: () => `"lang" attribute ${arguments[0].lang} in not properly capitalized`,
  E040: () => `Line length should not exceed ${arguments[0].maxlength} characters (current: ${arguments[0].length})`,
  E041: () => `Duplicate class: ${arguments[0].classes}`,
  E042: () => "Tag is not closed",
  E043: () => `Attribute "${arguments[0].attribute}" should come before "${arguments[0].previous}"`,
  E044: () => "Only <head> and <body> may be children of <html>",
  E045: () => "Tags in <html> may not be duplicated",
  E046: () => "<head> tag must come before <body> in <html>",
  E047: () => "The only tags allowed in the <head> are base, link, meta, noscript, script, style, template, and title",
  E049: () => "tag attributes are malformed",
  E051: () => `Invalid option or preset name: ${arguments[0].name}`,
  E052: () => `Not a preset: ${arguments[0].preset}`,
  E054: () => `Option ${arguments[0].name} does not exist`,
  E055: () => "Line contains trailing whitespace",
  E056: () => `Expected from ${arguments[0].expectedMin} to ${arguments[0].expectedMax} levels of indentation. ${arguments[0].value} levels instead`,
  E057: () => `Mandatory attribute "${arguments[0].attribute}" is missing in tag "${arguments[0].tag}"`,
  E058: () => 'rel="noopener" required for links with target="blank"'
};

module.exports.errors = {};

module.exports.renderMsg = function(code, data) {
  var format = errors[code];

  return format(data);
};

module.exports.renderIssue = function(issue) {
  return this.renderMsg(issue.code, issue.data);
};
