import { ActiveRuleDefinition, reportFunction, RuleDefinition } from "../../read-config";
import ClassStyleRule from "../class-style";
import IdStyleRule from "../id-style";
import { create_list_value_validator } from "../../validate_option";
import { Node } from "@linthtml/dom-utils/lib/dom_elements";

// TODO: Deprecate this rule
const RULE_NAME = "id-class-style";

function lint(
  node: Node,
  _config: unknown,
  {
    report,
    rules,
    global_config
  }: {
    report: reportFunction;
    rules: Record<string, ActiveRuleDefinition>;
    global_config: any;
  }
) {
  if (Boolean(rules["id-style"]) === false && rules["id-class-style"]) {
    IdStyleRule.lint(node, global_config["id-class-style"], {
      report,
      rules,
      global_config
    });
  }
  if (Boolean(rules["class-style"]) === false && rules["id-class-style"]) {
    ClassStyleRule.lint(node, global_config["id-class-style"], {
      report,
      rules,
      global_config
    });
  }
}

export default {
  name: RULE_NAME,
  validateConfig: create_list_value_validator(RULE_NAME, ["lowercase", "underscore", "dash", "camel", "bem"]),
  lint
} as RuleDefinition;
