import type { RuleDefinition } from "../../read-config.js";

const RULE_NAME = "indent-width-cont";

export default {
  name: RULE_NAME,
  deprecated: true,
  lint() {}
} satisfies RuleDefinition;
