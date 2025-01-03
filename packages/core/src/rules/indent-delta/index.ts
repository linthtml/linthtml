import type { RuleDefinition } from "../../read-config.js";

const RULE_NAME = "indent-delta";

export default {
  name: RULE_NAME,
  deprecated: true,
  deprecation_hint: "This rule does nothing and should be removed from the config file",
  lint() {}
} satisfies RuleDefinition;
