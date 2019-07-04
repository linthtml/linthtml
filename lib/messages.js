//TODO: add the possibility to use chalk ?
var errors = {
  E000: () => "not a valid error code",
  E001: (_) => `The attribute "${_.attribute}" attribute is banned`,
  E002: (_) => `Attribute names must match the format: ${_.format}`,
  E003: (_) => `The attribute ${_.attribute} is duplicated`,
  E004: () => "attribute values must not include unsafe characters",
  E005: (_) => `The attribute "${_.attribute}"  is not ${_.format}`,
  E006: () => "attribute values cannot be empty",
  E007: () => "<!DOCTYPE> should be the first element seen",
  E008: () => "The doctype must conform to the HTML5 standard",
  E009: (_) => `Use only ${_.format} links`,
  E010: () => "ids and classes may not use the word: ${_.word}",
  E011: (_) => `Value "${_.value}" of attribute "${_.attribute}" does not respect the format: ${_.format}`,
  E012: (_) => `the id "${_.id}" is already in use`,
  E013: () => "the `alt` property must be set for image tags",
  E014: () => "a source must be given for each `img` tag",
  E015: (_) => `line ending does not match format: ${_.format}`,
  E016: (_) => `the ${_.tag} tag is banned`,
  E017: () => "tag names must be lowercase",
  E018: (_) => `void element should ${_.expect} close itself`,
  E019: () => `all labels should have a "for" attribute`,
  E020: () => `label does not have a "for" attribute or a labeable child`,
  E021: (_) => `An element with the id "${_.id}" does not exist (should match a "for" attribute)`,
  E022: (_) => `The linked element is not labeable (id: ${_.id})`,
  E023: (_) => `${_.part} contains ${_.desc}: ${_.chars}`,
  E024: (_) => `${_.type} not allowed`,
  E025: () => "HTML element should specify the language of the page",
  E026: (_) => `${_.op} (all focusable elements on a page must either have a positive tabindex or none at all)`,
  E027: () => "The <head> tag must contain a title",
  E028: (_) => `The <head> tag can only contain one title: ${_.num} given`,
  E029: (_) => `Title "${_.title}" exceeds maximum length of ${_.maxlength}`,
  E030: () => "Tag start and end must match",
  E031: () => "Table must have a caption for accessibility",
  E032: () => "Figure must have a figcaption, figcaption must be in a figure (for accessibility)",
  E033: (_) => `Input with id: ${_.idValue} is not associated with a label for accessibility`,
  E034: () => "Radio input must have an associated name",
  E035: () => "Table must have a header for accessibility",
  E036: (_) => `Wrong indentation, expected indentation of ${_.expected} go ${_.width}`,
  E037: (_) => `Only ${_.limit} attributes per line are permitted`,
  E038: (_) => `"lang" attribute ${_.lang} is not valid`,
  E039: (_) => `"lang" attribute ${_.lang} in not properly capitalized`,
  E040: (_) => `Line length should not exceed ${_.maxlength} characters (current: ${_.length})`,
  E041: (_) => `Duplicate class: ${_.classes}`,
  E042: () => "Tag is not closed",
  E043: (_) => `Attribute "${_.attribute}" should come before "${_.previous}"`,
  E044: () => "Only <head> and <body> may be children of <html>",
  E045: () => "Tags in <html> may not be duplicated",
  E046: () => "<head> tag must come before <body> in <html>",
  E047: () => "The only tags allowed in the <head> are base, link, meta, noscript, script, style, template, and title",
  E049: () => "tag attributes are malformed",
  E051: (_) => `Invalid option or preset name: ${_.name}`,
  E052: (_) => `Not a preset: ${_.preset}`,
  E054: (_) => `Option ${_.name} does not exist`,
  E055: () => "Line contains trailing whitespace",
  E056: (_) => `Expected from ${_.expectedMin} to ${_.expectedMax} levels of indentation. ${_.value} levels instead`,
  E057: (_) => `Mandatory attribute "${_.attribute}" is missing in tag "${_.tag}"`,
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
