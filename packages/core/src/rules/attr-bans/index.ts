import type { reportFunction, RuleDefinition } from "../../read-config.js";
import { types } from "node:util";
import { is_tag_node } from "@linthtml/dom-utils";
import type { Node } from "@linthtml/dom-utils/dom_elements";

const { isRegExp } = types;

type Rule_Config = string | Array<string | RegExp> | RegExp | boolean;
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
    return config as unknown[];
  }
  if (typeof config === "string" || isRegExp(config)) {
    return config;
  }
  throw new Error(typeError(typeof config));
}

function mut_config(options: Rule_Config): Array<string | RegExp> {
  if (Array.isArray(options)) {
    return options.map((option) => {
      if (typeof option === "string") {
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

function lint(node: Node, config: Rule_Config, { report, fix }: { report: reportFunction; fix: boolean }) {
  if (is_tag_node(node)) {
    const banned_attrs = mut_config(config);
    const should_fix = fix ?? true;

    console.log(should_fix);
    if (should_fix) {
      const attributes = banned_attrs.reduce((attributes, attribute) => {
        return attributes.filter((attr) => {
          const attribute_name = attr.name.chars.toLowerCase();
          if (isRegExp(attribute)) {
            return attribute.test(attribute_name) === false;
          }
          return attribute_name !== attribute;
        });
      }, node.attributes);
      console.log(attributes);
      node.attributes = attributes;
      return;
    }
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

// @ts-expect-error
export default {
  name: RULE_NAME,
  validateConfig,
  lint
} as RuleDefinition;
