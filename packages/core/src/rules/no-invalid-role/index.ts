import type { Node } from "@linthtml/dom-utils";
import { attribute_value, has_non_empty_attribute, is_tag_node } from "@linthtml/dom-utils";
import type { reportFunction, RuleDefinition } from "../../read-config.js";
import {
  create_object_validator,
  get_config_type,
  is_boolean,
  run_validation_for_option_key
} from "../../validate_option.js";

// None of these elements can be marked with `role="presentation"` or `role="none"`.
// List from https://developer.mozilla.org/en-US/docs/Web/HTML/Element.
const ELEMENTS_DISALLOWING_PRESENTATION_OR_NONE_ROLE = new Set([
  "a",
  "abbr",
  "applet",
  "area",
  "audio",
  "b",
  "bdi",
  "bdo",
  "blockquote",
  "br",
  "button",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "form",
  "hr",
  "i",
  "iframe",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "main",
  "map",
  "mark",
  "menu",
  "menuitem",
  "meter",
  "noembed",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "pre",
  "progress",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "select",
  "small",
  "source",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
]);

// List of roles taken from https://www.w3.org/WAI/PF/aria/roles#widget_roles
const WIDGET_ROLES = new Set([
  "button",
  "checkbox",
  "gridcell",
  "link",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "progressbar",
  "radio",
  "scrollbar",
  "searchbox",
  "separator", // When focusable
  "slider",
  "spinbutton",
  "switch",
  "tab",
  "tabpanel",
  "textbox",
  "treeitem"
]);

const COMPOSITE_WIDGET_ROLES = new Set([
  "combobox",
  "grid",
  "listbox",
  "menu",
  "menubar",
  "radiogroup",
  "tablist",
  "tree",
  "treegrid"
]);

// https://www.w3.org/TR/wai-aria/#document_structure_roles
const DOCUMENT_STRUCTURE_ROLES = new Set([
  "application",
  "article",
  "associationlist",
  "associationlistitemkey",
  "associationlistitemvalue",
  "blockquote",
  "caption",
  "cell",
  "code",
  "columnheader",
  "comment",
  "definition",
  "deletion",
  "directory",
  "document",
  "emphasis",
  "feed",
  "figure",
  "generic",
  "group",
  "heading",
  "img",
  "insertion",
  "list",
  "listitem",
  "mark",
  "math",
  "meter",
  "none",
  "note",
  "paragraph",
  "presentation",
  "row",
  "rowgroup",
  "rowheader",
  "separator", // When not focusable
  "strong",
  "subscript",
  "suggestion",
  "superscript",
  "table",
  "term",
  "time",
  "toolbar",
  "tooltip"
]);

const LANDMARK_ROLES = new Set([
  "banner",
  "complementary",
  "contentinfo",
  "form",
  "main",
  "navigation",
  "region",
  "search"
]);

const LIVE_REGION_ROLES = new Set(["alert", "log", "marquee", "status", "timer"]);
const WINDOW_ROLES = new Set(["alertdialog", "dialog"]);

const VALID_ROLES = new Set([
  ...WIDGET_ROLES,
  ...COMPOSITE_WIDGET_ROLES,
  ...DOCUMENT_STRUCTURE_ROLES,
  ...LANDMARK_ROLES,
  ...LIVE_REGION_ROLES,
  ...WINDOW_ROLES
]);

const RULE_NAME = "no-invalid-role";

type RULE_CONFIG = {
  reportNoneExisting: boolean;
};

const DEFAULT_CONFIG = {
  reportNoneExisting: true
} satisfies RULE_CONFIG;

function lint(node: Node, config: RULE_CONFIG, { report }: { report: reportFunction }) {
  if (!is_tag_node(node) || !has_non_empty_attribute(node, "role")) {
    return;
  }

  const role_value = attribute_value(node, "role")?.chars as string; // cannot be empty here

  if (["presentation", "none"].includes(role_value) && ELEMENTS_DISALLOWING_PRESENTATION_OR_NONE_ROLE.has(node.name)) {
    report({
      code: "E066",
      position: node.loc,
      meta: {
        data: {
          tag: node.name
        }
      }
    });
  }

  if (config.reportNoneExisting && !VALID_ROLES.has(role_value.toLowerCase())) {
    report({
      code: "E067",
      position: node.loc,
      meta: {
        data: {
          tag: node.name,
          role: role_value
        }
      }
    });
  }
}

export default {
  name: RULE_NAME,
  configTransform(config, is_legacy) {
    if (is_legacy) {
      return get_config_type(config) === "boolean" ? DEFAULT_CONFIG : config;
    }
    return config ?? DEFAULT_CONFIG;
  },
  validateConfig: (config?: { reportNoneExisting: boolean }, is_legacy = true) => {
    if (config === undefined || config === null || (is_legacy && typeof config === "boolean")) {
      return config;
    }
    create_object_validator(RULE_NAME, ["reportNoneExisting"])(config);

    run_validation_for_option_key(is_boolean(RULE_NAME), "reportNoneExisting")(config);
  },
  lint
} as RuleDefinition;
