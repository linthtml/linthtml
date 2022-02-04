import { is_tag_node } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "tag-bans";

function validateConfig(options: unknown) {
  const typeError = (type: string) =>
    `Configuration for rule "${RULE_NAME}" is invalid: Expected string or string[] got ${type}`;
  if (Array.isArray(options)) {
    return options.forEach((option) => {
      const type = typeof option;
      if (type !== "string") {
        throw new Error(typeError(`${type}[]`));
      }
    });
  }
  if (typeof options !== "string") {
    throw new Error(typeError(typeof options));
  }
}

function mut_config(options: string | string[]): string[] {
  if (Array.isArray(options)) {
    return options.map((option) => option.toLowerCase());
  }
  if (typeof options === "string") {
    options = [options.toLowerCase()];
  }
  return options;
}

function lint(node: Node, config: string | string[], { report }: { report: reportFunction }) {
  if (is_tag_node(node)) {
    const banned_tags = mut_config(config);
    if (banned_tags.indexOf(node.name) !== -1) {
      report({
        code: "E016",
        position: node.open.loc,
        meta: {
          data: {
            tag: node.name
          }
        }
      });
    }
  }
}

export default {
  name: RULE_NAME,
  validateConfig,
  lint
} as RuleDefinition;
