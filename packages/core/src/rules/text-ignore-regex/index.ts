import type { RuleDefinition } from "../../read-config.js";

import { create_string_or_regexp_validator } from "../../validate_option.js";

const RULE_NAME = "text-ignore-regex";

export default {
  name: RULE_NAME,
  deprecated: true,
  deprecation_hint: "This is not a rule, it's a deprecated setting doing nothing currently.",
  validateConfig: create_string_or_regexp_validator(RULE_NAME),
  lint() {}
} as RuleDefinition;

// var regex = /[^\\](&[^a-zA-Z0-9#;]*;)|([&<>])|(&[a-zA-Z0-9#]*[^a-zA-Z0-9#;])/gm;
// const regex = /\\[^a-zA-Z0-9\-_ \n\r\s\\]/g;
// function lint() {
//   var issues = [],
//     ignore = opts["text-ignore-regex"];

//   function addIssues(text, lineCol, partDesc) {
//     // Replace ignored parts with spaces (to preserve line/col numbering)
//     text = text.replace(ignore, function(match) {
//       return match.replace(/./g, " ");
//     });
//       match;

//     if (regex.test(text) === false) {
//       const REGEXP = /[^a-z0-9\-_ \\]/gi;
//       while ((match = REGEXP.exec(text)) !== null) {
//         var i = 1;
//         issues.push(
//           new Issue("E023", lineColFunc(match.index), {
//             chars: match[i],
//             part: partDesc,
//             desc: messages[i]
//           })
//         );
//       }
//     }
//   }

//   // if it's text - make sure it only has alphanumericals. If it has a &, a ; should follow.
//   if (element.type === "text" && element.data.length > 0) {
//     addIssues(element.data, element.lineCol, "text");
//   }

//   var attrs = element.attribs;
//   if (attrs) {
//     Object.keys(attrs).forEach(function(name) {
//       var v = attrs[name];
//       addIssues(v.value, v.valueLineCol, "attribute value");
//     });
//   }
//   return issues;
// };
