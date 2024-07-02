import chalkTemplate from "chalk-template";
import type { CharValue, Range } from "@linthtml/dom-utils/dom_elements";
import type Issue from "./issue.js";

export const CORE_ERRORS: { [code: string]: (meta?: Record<string, unknown>) => string } = {
  "01": (meta) =>
    chalkTemplate`{red Error:} Cannot find a config file in the directory {underline ${meta?.config_path}}`,
  "02": (meta) => chalkTemplate`{red Error:} Cannot find the config file {underline ${meta?.config_path}}`,
  "03": (meta) => chalkTemplate`{red Error:} Cannot find module "${meta?.module_name}" to extends`,
  "04": (meta) =>
    chalkTemplate`{red Error:} Failed to load parser "${meta?.module_name}". Cannot find module "${meta?.module_name}"`,
  "05": (meta) =>
    chalkTemplate`{red Error:} Cannot find plugin "${meta?.module_name}", make sure it's installed locally.`,
  "06": (meta) =>
    chalkTemplate`{red Error:} Plugins should expose rules having a property "name". The plugin "${meta?.plugin_name}" is not doing this, so it will not work. Please file an issue with the plugin.`,
  "07": (meta) =>
    chalkTemplate`{red Error:} Plugin rules have to be namespaced, i.e. only "plugin-namespace/plugin-rule-name" plugin rule names are supported. The plugin rule "${meta?.rule_name}" from plugin "${meta?.plugin_name}" does not do this, so will not work. Please file an issue with the plugin.`,
  "08": (meta) =>
    chalkTemplate`{red Error:} Plugin rules needs to define a "lint" function. The plugin rule "${meta?.rule_name}" from plugin "${meta?.plugin_name}" does not do this, so will not work. Please file an issue with the plugin.`,
  "09": () => chalkTemplate`{red Error:} Plugins should expose rules under the property "rules" and as an array.`,
  "10": (meta) =>
    chalkTemplate`{red Error:}  Cannot resolve plugin ${meta?.module_name}. NodeJS reported the following error.\n${meta?.message}`
} as const;

// TODO: add the possibility to use chalk ?
export const ISSUE_ERRORS = {
  E000: (/* data */) => "not a valid error code",
  E001: (data: { attribute: string }) => `The attribute "${data.attribute}" attribute is cannot be used as it's banned`,
  E002: (data: { format: string; attribute: string }) =>
    `The attribute "${data.attribute}" must be written using the format "${data.format}"`,
  E003: (data: { attribute: string }) => `The attribute ${data.attribute} is duplicated`,
  E004: (data: { attribute: string }) => `The value of the attribute "${data.attribute}" contains unsafe characters`,
  E005: (data: { attribute: string; format: string }) => `The attribute "${data.attribute}" is not ${data.format}`,
  E006: (data: { attribute: string }) => `The attribute "${data.attribute}" requires a value`,
  E007: (/* data */) => "The first element of the document should be <!DOCTYPE>",
  E008: (/* data */) => "The doctype must conform to the HTML5 standard",
  E009: (data: { format: string }) => `Invalid href for link, only ${data.format} links are allowed`,
  E010: (data: { attribute: string; word: string }) =>
    `The value of attribute "${data.attribute}" contains the word "${data.word}" which is not allowed`,
  E011: (data: { value: string; format: string; attribute: string }) =>
    `The value "${data.value}" of attribute "${data.attribute}" does not respect the format: ${data.format}`,
  E012: (data: { id: string; line: number; column: number }) =>
    `The id "${data.id}" is already used at L${data.line}:c${data.column}`,
  E013: (/* data */) => 'The "alt" attribute must be set for <img> tag',
  E014: (/* data */) => 'The "src" attribute must be set for each <img> tag',
  E015: (data: { format: string }) => `Line ending does not match format: ${data.format}`,
  E016: (data: { tag: string }) => `The tag <${data.tag}> is banned and should not be used`,
  E017: (data: { name: string }) => `Invalid case for tag <${data.name}>, tag names must be written in lowercase`,
  E018: (data: { expect: "always" | "never" }) => `Void element should ${data.expect} close itself`,
  E019: (/* data */) => 'The label has no attribute "for"',
  E020: (/* data */) => 'The Label does not have a "for" attribute or a labelable child',
  E021: (data: { id: string }) =>
    `There's no element with an id matching the one provided to the "for" attribute. Provided id is "${data.id}"`,
  E022: (data: { id: string }) => `The element with the id "${data.id}" is not labelable`,
  E023: (data: { part: string; desc: string; chars: string }) => `${data.part} contains ${data.desc}: ${data.chars}`,
  E024: (
    data: {
      tagName: string;
      expected_indentation: number;
      expected_type: "spaces" | "tabs" | "mixed";
      current_indentation: number;
      current_type: "spaces" | "tabs" | "mixed";
    },
    { start }: Range
  ) => {
    return `Incorrect indentation for \`${data.tagName}\` beginning at L${start.line}:C${start.column}. Expected indentation of ${data.expected_indentation} ${data.expected_type} but found ${data.current_indentation} ${data.current_type}.`;
  },
  E025: (/* data */) => '<HTML> tag should specify the language of the page using the "lang" attribute',
  E026: (data: { tabindex: number }) =>
    `The element has a tabindex of ${data.tabindex}, all focusable elements on a page must either have a negative number or 0 as tabindex`,
  E027: (/* data */) => "The <head> tag must contain a title",
  E028: (data: { num: number }) => `The <head> tag can only contain one title: ${data.num} given`,
  E029: (data: { title: string; max_length: number }) =>
    `Title "${data.title}" exceeds maximum length of ${data.max_length}`,
  E030: (data: { open: CharValue }) =>
    `Tag close does not match opened tag at C${data.open.loc.start.line}:L${data.open.loc.start.column}`,
  E031: (/* data */) => "Table must have captions (<caption>) for accessibility",
  E032: (/* data */) => "Tag <figure> must contains a <figcaption> tag for accessibility",
  E033: (data: { idValue: string }) => `Input with id "${data.idValue}" has no associated label`,
  E034: (/* data */) => "Radio input must have an associated name",
  E035: (/* data */) => "Table must contains a header (<thead>) for accessibility",
  E036: (
    data: { isClose: boolean; tagName: string; expected_indentation: number; current_indentation: number },
    { start }: Range
  ) => {
    const tag = data.isClose ? `<\\${data.tagName}>` : `<${data.tagName}>`;
    return `Incorrect indentation for \`${data.tagName}\` beginning at L${start.line}:C${start.column}. Expected \`${tag}\` to be at an indentation of ${data.expected_indentation} but was found at ${data.current_indentation}.`;
  },
  E037: (data: { limit: string }) => `Only ${data.limit} attributes per line are permitted`,
  E038: (data: { lang: string }) => `Value "${data.lang}" for attribute "lang" is not valid`,
  E039: (data: { lang: string }) => `Value "${data.lang}" for attribute "lang" is not properly capitalized`,
  E040: (data: { length: number; maxlength: number }) =>
    `This line has a length of ${data.length}. Maximum allowed is ${data.maxlength}`,
  E041: (data: { classes: string }) => `The "class" attribute already contains "${data.classes}"`,
  E042: (/* data */) => "Tag is not closed",
  E043: (data: { attribute: string; previous: string }) =>
    `Attribute "${data.attribute}" should come before "${data.previous}"`,
  E044: (/* data */) => "Only <head> and <body> may be children of <html>",
  E045: (/* data */) => "Tags in <html> may not be duplicated",
  E046: (/* data */) => "Tag <head> must come before <body> in <html>",
  E047: (/* data */) =>
    "The only tags allowed in the <head> are base, link, meta, noscript, script, style, template, and title",
  E049: (/* data */) => "The tag attributes are malformed",
  E051: (data: { name: string }) =>
    `unrecognized rule name or preset \`${data.name}\` in linthtml-configure instruction`,
  E052: (data: { preset: string }) => `unrecognized preset name \`${data.preset}\` in linthtml-configure instruction `,
  E055: (/* data */) => "Line contains trailing whitespace",
  E056: (data: { expectedMin: number; expectedMax: number; value: string }) =>
    `Expected from ${data.expectedMin} to ${data.expectedMax} levels of indentation. ${data.value} levels instead`,
  E057: (data: { attribute: string; tag: string }) =>
    `Mandatory attribute "${data.attribute}" is missing in tag <${data.tag}>`,
  E058: (/* data */) => 'Links should with `target="blank"` should define `rel="noopener"`',
  E059: (data: { content: string; min_length: number }) =>
    `Link text should have at least ${data.min_length} chars, current text "${data.content}" has a length of ${data.content.length}`,
  E060: (/* data */) => 'Input elements with type "button", "submit" and "reset" must have a value or title attribute.',
  E061: (/* data */) => "Each button element must have a text content.",
  E062: (/* data */) => "A <label> element should not encapsulate select and textarea elements.",
  E063: (/* data */) => "Each fieldset element should contain a legend element.",
  E064: (data: { is_before: boolean }) => `Unexpected space ${data.is_before ? "before" : "after"} text.`,
  E065: (/* data */) => "something something",

  INLINE_01: (data: { instruction: string }) => `unrecognized linthtml instruction: \`linthtml-${data.instruction}\``,
  INLINE_02: (data: { rule_name: string }) => `unrecognized rule name \`${data.rule_name}\` in inline configuration`,
  INLINE_03: (data: { rule_configuration: string }) =>
    `malformed linthtml-configure instruction: \`${data.rule_configuration}\` is not valid JSON global`,
  INLINE_04: (data: { rule_name: string; error: string }) =>
    `linthtml-configure instruction for rule \`${data.rule_name}\` is not valid. ${data.error}`,

  DEPRECATED_RULE: (data: { rule_name: string; hint?: string }) =>
    `Rule "${data.rule_name}" is deprecated.${data.hint ? ` ${data.hint}` : ""}`
} as const;

// Error code INLINE-xx
// module.exports.INLINE_ERRORS = {
//   "01": ({ instruction }) => `unrecognized linthtml instruction: \`linthtml-${instruction}\``
// };

export function renderIssue(issue: Issue): string {
  const format = ISSUE_ERRORS[issue.code as keyof typeof ISSUE_ERRORS];
  // @ts-expect-error Type of data and format too complex
  return format ? format(issue.data, issue.position) : issue.message ?? "";
}

export function get_issue_message(issue: Issue) {
  const generate_issue_message = ISSUE_ERRORS[issue.code as keyof typeof ISSUE_ERRORS];
  // @ts-expect-error Type of data and format too complex
  return generate_issue_message(issue.data, issue.position);
}
