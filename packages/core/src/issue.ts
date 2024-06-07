import type { Range } from "@linthtml/dom-utils/dom_elements";

export const ISSUE_SEVERITY = {
  ERROR: "error",
  WARNING: "warning"
};

export default class Issue {
  code: string;
  position: Range | null;
  rule: string;
  message: string;
  data: Record<string, unknown> = {};
  severity: (typeof ISSUE_SEVERITY)[keyof typeof ISSUE_SEVERITY] = ISSUE_SEVERITY.ERROR;

  // TODO: CHECK why options.rule (legacy, need to be removed)
  constructor(
    rule_name: string,
    position: Range | null,
    options: {
      code: string;
      rule?: string;
      message?: string;
      data?: Record<string, unknown>;
      severity?: (typeof ISSUE_SEVERITY)[keyof typeof ISSUE_SEVERITY];
    }
  ) {
    this.position = position;
    this.code = options.code;
    this.rule = rule_name;
    this.message = options.message ?? "";
    this.data = options.data || {};
    this.severity = options.severity || ISSUE_SEVERITY.ERROR;
  }
}
