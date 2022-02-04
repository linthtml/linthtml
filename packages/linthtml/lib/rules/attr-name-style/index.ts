import match_format from "../../utils/check_format";
import { is_tag_node } from "@linthtml/dom-utils";
import { create_string_or_regexp_validator } from "../../validate_option";
import { types } from "util";
import { LegacyLinterConfig, reportFunction, RuleDefinition } from "../../read-config";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const { isRegExp } = types;

// TODO: Deprecate "attr-name-ignore-regex" "rule" and add a setting to ignore attribute in this rule
const RULE_NAME = "attr-name-style";

function lint(
  node: Node,
  format: string | RegExp,
  { report, global_config }: { report: reportFunction; global_config: LegacyLinterConfig }
) {
  if (is_tag_node(node)) {
    // const format = config[this.name];
    // TODO: Remove after `raw-ignore-text` refacto
    let attributes = node.attributes.filter(({ name }) => /^¤+$/.test(name.chars) === false);
    const ignore = global_config["attr-name-ignore-regex"];
    if (ignore) {
      const R_ignore = isRegExp(ignore) ? ignore : new RegExp(ignore);
      attributes = attributes.filter(({ name }) => match_format(R_ignore, name.chars) === false);
    }

    attributes.forEach(({ name }) => {
      if (match_format(format, name.chars) === false) {
        report({
          code: "E002",
          position: name.loc,
          meta: {
            data: {
              format,
              attribute: name.chars
            }
          }
        });
      }
    });
  }
}

export default {
  name: RULE_NAME,
  validateConfig: create_string_or_regexp_validator(RULE_NAME),
  lint
} as RuleDefinition;
