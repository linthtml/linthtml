import { reportFunction, RuleDefinition } from "../../read-config";
import { types } from "util";
import { is_tag_node } from "@linthtml/dom-utils";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const { isRegExp } = types;

const RULE_NAME = "attr-bans";
function validateConfig(config: unknown) {
  const typeError = (type: string) =>
    `Configuration for rule "${RULE_NAME}" is invalid: Expected string, RegExp or (string|RegExp)[] got ${type}`;
  if (Array.isArray(config)) {
    config.forEach((attr) => {
      const type = typeof attr;
      if (type !== "string" && isRegExp(attr) === false) {
        throw new Error(typeError(`${type}[]`));
      }
    });
    return config;
  }
  if (typeof config === "string" || isRegExp(config)) {
    return config;
  }
  throw new Error(typeError(typeof config));
}

function mut_config(options: any | any[]): any[] {
  if (Array.isArray(options)) {
    return options.map((option) => {
      const type = typeof option;
      if (type === "string") {
        return option.toLowerCase();
      }
      if (isRegExp(option)) {
        return option;
      }
      return option;
    });
  }
  if (typeof options === "string" || isRegExp(options)) {
    options = [options];
  }
  if (typeof options === "boolean") {
    options = [];
  }
  return options;
}

function lint(node: Node, config: unknown, { report }: { report: reportFunction }) {
  if (is_tag_node(node)) {
    const banned_attrs = mut_config(config);
    banned_attrs.forEach((banned) => {
      const attributes = node.attributes.filter(({ name }) => {
        const attribute_name = name.chars.toLowerCase();
        if (isRegExp(banned)) {
          return banned.test(attribute_name) === true;
        }
        return attribute_name === banned;
      });
      attributes.forEach((attribute) =>
        report({
          code: "E001",
          position: attribute.loc,
          meta: {
            data: {
              attribute: attribute.name.chars.toLowerCase()
            }
          }
        })
      );
    });
  }
}

export default {
  name: RULE_NAME,
  validateConfig,
  lint
} as RuleDefinition;
