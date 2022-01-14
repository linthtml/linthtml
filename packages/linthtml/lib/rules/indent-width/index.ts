import { RuleDefinition } from "../../read-config";
import { create_number_validator } from "../../validate_option";
import IndentStyleRule from "../indent-style/index";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

const RULE_NAME = "indent-width";

function lint(node: Node, config: unknown, obj: any) {
  if (Boolean(obj.rules["indent-style"]) === false) {
    return IndentStyleRule.lint(node, config, obj);
  }
}

export default {
  name: RULE_NAME,
  validateConfig: create_number_validator(RULE_NAME, false),
  lint
} as RuleDefinition;
