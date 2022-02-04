import { Range } from "@linthtml/dom-utils/lib/dom_elements";

export default class Issue {
  code: string;
  position: Range;
  rule: string;
  message: string;
  data: unknown = {};
  severity: "error" | "warning" = "error";

  // TODO: CHECK why options.rule
  constructor(
    rule_name: string,
    position: Range,
    options: {
      code: string;
      rule: string;
      message?: string;
      data?: unknown;
      severity?: "error" | "warning";
    }
  ) {
    this.position = position;
    this.code = options.code;
    this.rule = rule_name;
    this.message = options.message ?? "";
    this.data = options.data || {};
    this.severity = options.severity || "error";
  }
}
