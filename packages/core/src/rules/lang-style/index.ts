import type { reportFunction, RuleDefinition } from "../../read-config.js";
import { is_tag_node, attribute_value, has_non_empty_attribute } from "@linthtml/dom-utils";
import type { CharValue, Node } from "@linthtml/dom-utils/dom_elements";
import tags from "language-tags";

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

    const tag = tags(lang.chars);

    if (!tag.valid()) {
      const isDeprecated = tag.deprecated() !== undefined;
      report({
        code: "E038",
        position: lang.loc,
        meta: {
          data: {
            lang: lang.chars,
            isDeprecated,
            preferred: isDeprecated && tag.preferred().format()
          }
        }
      });
    }

    if (lang_case === "case" && tag.format() !== lang.chars) {
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
