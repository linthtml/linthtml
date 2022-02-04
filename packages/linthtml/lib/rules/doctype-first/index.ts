import { Node } from "@linthtml/dom-utils/lib/dom_elements";
import { is_tag_node, is_text_node, is_directive_node, is_comment_node } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";

const RULE_NAME = "doctype-first";

function validateConfig(option: unknown) {
  if (typeof option === "string" && option !== "smart") {
    throw new Error(`Configuration for rule "${RULE_NAME}" is invalid: Only "smart" is accepted as string value`);
  }

  if (typeof option !== "boolean" && typeof option !== "string") {
    throw new Error(`Configuration for rule "${RULE_NAME}" is invalid: Expected boolean got ${typeof option}`);
  }

  return option;
}

function is_whitespace(node: Node) {
  return is_text_node(node) && /^[ \t\n\f\r]*$/.test(node.data);
}

function lint(node: Node, mode: string, { report }: { report: reportFunction }) {
  // CHECK if parent if first child instead
  // USE util function to check node type
  // @ts-ignore
  if (this.passedFirst || is_comment_node(node) || is_whitespace(node)) {
    return;
  }
  // @ts-ignore
  this.passedFirst = true;

  if (is_directive_node(node) && node.name.toUpperCase() === "!DOCTYPE") {
    return;
  }

  // If the option is 'smart', fail only if a head tag is present.
  if (mode === "smart" && !(is_tag_node(node) && node.name.toLowerCase() === "head")) {
    return;
  }

  report({
    code: "E007",
    position: node.open ? node.open.loc : node.loc
  });
}

export default {
  name: RULE_NAME,
  validateConfig,
  lint,
  passedFirst: false,
  end() {
    // @ts-ignore
    this.passedFirst = false;
    return [];
  }
} as RuleDefinition;
