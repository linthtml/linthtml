import { Element, Node, NodeAttribute } from "@linthtml/dom-utils/lib/dom_elements";
import { is_tag_node } from "@linthtml/dom-utils";
import { reportFunction, RuleDefinition } from "../../read-config";

const RULE_NAME = "attr-new-line";

function validateConfig(limit: number) {
  if (typeof limit === "number" || limit === "+0") {
    return limit;
  }
  throw new Error(`Configuration for rule "${RULE_NAME}" is invalid: Expected number or "+0" got ${typeof limit}`);
}

function lint(node: Node, limit: "+0" | number, { report }: { report: reportFunction }) {
  const reportIssue = (attribute: NodeAttribute) =>
    report({
      code: "E037",
      position: attribute.loc,
      meta: {
        data: {
          limit
        }
      }
    });

  if (is_tag_node(node) === false) {
    return;
  }

  const attributes_lines = (node as Element).attributes.reduce((m, attribute) => {
    const line = m.get(attribute.loc.start.line) || [];
    m.set(attribute.loc.start.line, line.concat([attribute]));
    if (attribute.loc.end.line !== attribute.loc.start.line) {
      const line = m.get(attribute.loc.end.line) || [];
      m.set(attribute.loc.end.line, line.concat([attribute]));
    }
    return m;
  }, new Map<number, NodeAttribute[]>());

  const allow_attributes_on_first_line = limit === "+0" || limit > 0;
  const row_limit = limit === 0 || limit === "+0" ? 1 : Math.floor(limit);

  const tag_line = node.open.loc.start.line;

  const it = attributes_lines.entries();
  let tmp = it.next();
  while (!tmp.done) {
    const [line, attributes] = tmp.value;
    if (line === tag_line) {
      const nb_attributes_allowed = allow_attributes_on_first_line ? row_limit : 0;
      attributes.slice(nb_attributes_allowed).map(reportIssue);
    } else {
      attributes.slice(row_limit).map(reportIssue);
    }
    tmp = it.next();
  }
}

export default {
  name: RULE_NAME,
  validateConfig,
  lint
} as RuleDefinition;
