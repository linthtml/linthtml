import match_format from "../../utils/check_format";
import { is_tag_node } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";
import { create_list_value_validator } from "../../validate_option";
import { types } from "util";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const { isRegExp } = types;

const RULE_NAME = "id-style";

// TODO: Check behavoir with empty id attribute
function lint(
  node: Node,
  format: string | RegExp,
  { report, global_config }: { report: reportFunction; global_config: any }
) {
  if (is_tag_node(node) && format !== "none") {
    const ignore: undefined | string | RegExp = global_config["id-class-ignore-regex"];

    // TODO: Remove after `raw-ignore-text` refacto
    let attributes = node.attributes
      .filter(({ name }) => /^¤+$/.test(name.chars) === false)
      .filter(({ name }) => name.chars.toLowerCase() === "id")
      .filter(({ value }) => value && /^¤+$/.test(value.raw as string) === false);

    if (ignore) {
      const R = isRegExp(ignore) ? ignore : new RegExp(ignore);
      attributes = attributes.filter(({ value }) => value && R.test(value.chars) === false); // raw or chars ?
    }

    attributes.forEach((attribute) => {
      const id = attribute.value?.chars as string;
      if (match_format(format, id) === false) {
        report({
          code: "E011",
          position: attribute.loc,
          meta: {
            data: {
              attribute: "id",
              format: format,
              value: id
            }
          }
        });
      }
    });
  }
}

export default {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(RULE_NAME, ["none", "lowercase", "underscore", "dash", "camel", "bem"]),
  lint
} as RuleDefinition;
