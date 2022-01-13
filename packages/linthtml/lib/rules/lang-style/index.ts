import { reportFunction, RuleDefinition } from "../../read-config";
import { check_lang_attribute, is_tag_node, attribute_value, has_non_empty_attribute } from "@linthtml/dom-utils";
import { CharValue, Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "lang-style";

function validateConfig(style: string) {
  if (typeof style === "string" && style !== "case") {
    throw new Error(`Configuration for rule "${RULE_NAME}" is invalid: Only "case" is accepted as string value`);
  }

  if (typeof style !== "boolean" && typeof style !== "string") {
    throw new Error(`Configuration for rule "${RULE_NAME}" is invalid: Expected boolean got ${typeof style}`);
  }

  return style;
}

function lint(node: Node, lang_case: string, { report }: { report: reportFunction }) {
  if (is_tag_node(node) && node.name === "html" && has_non_empty_attribute(node, "lang")) {
    const lang = attribute_value(node, "lang") as CharValue;

    // TODO: Remove after `raw-ignore-text` refacto
    if (/^¤+$/.test(lang.chars)) {
      return;
    }

    const valid = check_lang_attribute(lang); // WHAT???
    if (valid === 1) {
      report({
        code: "E038",
        position: lang.loc,
        meta: {
          data: {
            lang: lang.chars
          }
        }
      });
    }
    if (lang_case === "case" && valid === 2) {
      report({
        code: "E039",
        position: lang.loc,
        meta: {
          data: {
            lang: lang.chars
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
